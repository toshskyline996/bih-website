/// <reference types="@cloudflare/workers-types" />
// worker.ts — Cloudflare Workers + Assets 模式入口
// 作用: 将 /api/* 请求路由到对应处理函数，其余请求交给静态资源服务
// 背景: wrangler.jsonc 中配置了 "assets"，使项目以 Workers+Assets 模式部署
//       该模式下 functions/ 目录不会被自动识别，需要此文件手动桥接

import { onRequestPost as shippingPost, onRequestOptions as shippingOpts } from './functions/api/shipping-rates';
import { onRequestPost as paymentPost, onRequestOptions as paymentOpts } from './functions/api/create-payment-intent';
import { onRequestPost as qboPost, onRequestOptions as qboOpts } from './functions/api/qbo-sync';
import { onRequestPost as webhookPost, onRequestOptions as webhookOpts } from './functions/api/stripe-webhook';
import { onRequestGet as invPingGet, onRequestOptions as invPingOpts } from './functions/api/inventory-ping';
import { onRequestGet as invSkuGet, onRequestPost as invSkuPost, onRequestOptions as invSkuOpts } from './functions/api/inventory-sku';
import { onRequestGet as invUnitsGet, onRequestOptions as invUnitsOpts } from './functions/api/inventory-units';
import { onRequestPost as invInboundPost, onRequestOptions as invInboundOpts } from './functions/api/inventory-inbound';
import { onRequestPost as invScanPost, onRequestOptions as invScanOpts } from './functions/api/inventory-scan-out';
import { onRequestGet as invUnitGet, onRequestPatch as invUnitPatch, onRequestOptions as invUnitOpts } from './functions/api/inventory-unit';

export interface WorkerEnv {
  ASSETS: Fetcher;
  STRIPE_SECRET_KEY: string;
  QUICKBOOKS_CLIENT_ID: string;
  QUICKBOOKS_CLIENT_SECRET: string;
  QUICKBOOKS_REFRESH_TOKEN: string;
  QUICKBOOKS_REALM_ID: string;
  STRIPE_WEBHOOK_SECRET: string;
  QUICKBOOKS_SANDBOX?: string;
  MANITOULIN_API_TOKEN?: string;
  // OpenSky flight proxy
  OPENSKY_CLIENT_ID: string;
  OPENSKY_CLIENT_SECRET: string;
  KV_CACHE: KVNamespace;
  // Inventory system
  INVENTORY_DB: D1Database;
  INVENTORY_ADMIN_SECRET: string;
  // Intel API proxy — same value as API_SECRET in bih-intel-api Worker.
  // Set via: wrangler secret put INTEL_API_SECRET  (in bih-website project)
  INTEL_API_SECRET: string;
}

// Pacific bounding box split into two halves to avoid dateline crossing
// West half: China coast + Western Pacific | East half: Eastern Pacific → BC
const OPENSKY_BBOXES = [
  'lamin=28&lomin=118&lamax=62&lomax=180',   // China coast → dateline
  'lamin=28&lomin=-180&lamax=62&lomax=-120', // dateline → BC coast
];

const FLIGHTS_CACHE_KEY = 'flights:pacific';
const FLIGHTS_CACHE_TTL = 300; // 5 minutes

const JSON_CORS = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

async function handleFlightsProxy(env: WorkerEnv): Promise<Response> {
  const parseStates = (raw: { time: number; states: unknown[][] | null }) =>
    (raw.states ?? []).map((s: unknown[]) => ({
      icao24:    s[0],
      callsign:  (s[1] as string)?.trim() || null,
      lon:       s[5],
      lat:       s[6],
      velocity:  s[9],
      heading:   s[10],
      on_ground: s[8],
    })).filter((s: { lat: unknown; lon: unknown }) => s.lat != null && s.lon != null);

  try {
    // Basic auth with client_id:client_secret — bypasses OAuth2 token endpoint
    const basicAuth = 'Basic ' + btoa(`${env.OPENSKY_CLIENT_ID}:${env.OPENSKY_CLIENT_SECRET}`);
    const headers = { Authorization: basicAuth };

    // Fetch both halves of the Pacific route in parallel
    const [r1, r2] = await Promise.all(
      OPENSKY_BBOXES.map(bbox =>
        fetch(`https://opensky-network.org/api/states/all?${bbox}`, { headers })
      )
    );

    if (!r1.ok && !r2.ok) {
      // Rate limited — serve cached data if available, else empty
      if (r1.status === 429 || r2.status === 429) {
        const cached = await env.KV_CACHE.get(FLIGHTS_CACHE_KEY);
        if (cached) return new Response(cached, { headers: { ...JSON_CORS, 'X-Cache': 'stale-ratelimit' } });
      }
      // OpenSky unavailable — serve cached data if available, else empty states (no 502)
      const cached = await env.KV_CACHE.get(FLIGHTS_CACHE_KEY);
      if (cached) return new Response(cached, { headers: { ...JSON_CORS, 'X-Cache': 'stale-error' } });
      return new Response(JSON.stringify({ ok: true, time: 0, states: [] }), { headers: JSON_CORS });
    }

    const [d1, d2] = await Promise.all([
      r1.ok ? r1.json() as Promise<{ time: number; states: unknown[][] | null }> : Promise.resolve({ time: 0, states: null }),
      r2.ok ? r2.json() as Promise<{ time: number; states: unknown[][] | null }> : Promise.resolve({ time: 0, states: null }),
    ]);

    const states = [...parseStates(d1), ...parseStates(d2)];
    const body = JSON.stringify({ ok: true, time: d1.time || d2.time, states });

    // Cache the successful response
    await env.KV_CACHE.put(FLIGHTS_CACHE_KEY, body, { expirationTtl: FLIGHTS_CACHE_TTL });

    return new Response(body, { headers: JSON_CORS });
  } catch (e) {
    // Network / parse error — try cache before giving up
    try {
      const cached = await env.KV_CACHE.get(FLIGHTS_CACHE_KEY);
      if (cached) return new Response(cached, { headers: { ...JSON_CORS, 'X-Cache': 'stale-exception' } });
    } catch { /* KV unavailable */ }
    return new Response(JSON.stringify({ ok: true, time: 0, states: [] }), { headers: JSON_CORS });
  }
}

// 将 Worker 参数包装成 Pages Function 兼容的 EventContext 对象
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCtx(request: Request, env: WorkerEnv, execCtx: ExecutionContext): any {
  return {
    request,
    env,
    params: {},
    data: {},
    functionPath: new URL(request.url).pathname,
    waitUntil: execCtx.waitUntil.bind(execCtx),
    passThroughOnException: () => {},
    next: async () => new Response(null, { status: 404 }),
  };
}

// Bot probe paths that should never exist on this site — return 404 immediately
const BOT_PROBE_RE = /\/(wp-|xmlrpc|wlwmanifest|phpmyadmin|\.env|\.git|cgi-bin|vendor|\.php)/i;

export default {
  async fetch(request: Request, env: WorkerEnv, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      // Normalise multiple consecutive slashes (e.g. //wp2/... → /wp2/...)
      const pathname = url.pathname.replace(/\/+/g, '/');
      const method = request.method;

      // ── Early-exit for bot probes — clean 404, no exception, no log noise ──
      if (BOT_PROBE_RE.test(pathname)) {
        return new Response('Not Found', { status: 404 });
      }

      const c = toCtx(request, env, ctx);

      // ── API 路由 ────────────────────────────────────────────────────────────
      if (pathname === '/api/shipping-rates') {
        if (method === 'OPTIONS') return shippingOpts(c);
        if (method === 'POST')    return shippingPost(c);
        return new Response(null, { status: 405 });
      }

      if (pathname === '/api/create-payment-intent') {
        if (method === 'OPTIONS') return paymentOpts(c);
        if (method === 'POST')    return paymentPost(c);
        return new Response(null, { status: 405 });
      }

      if (pathname === '/api/qbo-sync') {
        if (method === 'OPTIONS') return qboOpts(c);
        if (method === 'POST')    return qboPost(c);
        return new Response(null, { status: 405 });
      }

      if (pathname === '/api/stripe-webhook') {
        if (method === 'OPTIONS') return webhookOpts(c);
        if (method === 'POST')    return webhookPost(c);
        return new Response(null, { status: 405 });
      }

      if (pathname === '/api/flights') {
        if (method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Allow-Headers': 'Content-Type' } });
        if (method === 'GET')     return handleFlightsProxy(env);
        return new Response(null, { status: 405 });
      }

      // ── Inventory API ──────────────────────────────────────────────────────
      if (pathname === '/api/inventory/ping') {
        if (method === 'OPTIONS') return invPingOpts(c);
        if (method === 'GET')     return invPingGet(c);
        return new Response(null, { status: 405 });
      }

      if (pathname === '/api/inventory/sku') {
        if (method === 'OPTIONS') return invSkuOpts(c);
        if (method === 'GET')     return invSkuGet(c);
        if (method === 'POST')    return invSkuPost(c);
        return new Response(null, { status: 405 });
      }

      if (pathname === '/api/inventory/units') {
        if (method === 'OPTIONS') return invUnitsOpts(c);
        if (method === 'GET')     return invUnitsGet(c);
        return new Response(null, { status: 405 });
      }

      if (pathname === '/api/inventory/inbound') {
        if (method === 'OPTIONS') return invInboundOpts(c);
        if (method === 'POST')    return invInboundPost(c);
        return new Response(null, { status: 405 });
      }

      if (pathname === '/api/inventory/scan-out') {
        if (method === 'OPTIONS') return invScanOpts(c);
        if (method === 'POST')    return invScanPost(c);
        return new Response(null, { status: 405 });
      }

      if (pathname.startsWith('/api/inventory/unit/')) {
        if (method === 'OPTIONS') return invUnitOpts(c);
        if (method === 'GET')     return invUnitGet(c);
        if (method === 'PATCH')   return invUnitPatch(c);
        return new Response(null, { status: 405 });
      }

      if (pathname === '/api/track-compat') {
        // Lock CORS to our own domain: /api/track-compat is only called by our
        // own frontend JS.  Wildcard '*' would let any third-party site POST
        // fake compat events to flood the analytics table.
        const origin = request.headers.get('Origin') ?? '';
        const COMPAT_ALLOWED = new Set([
          'https://freightracing.ca',
          'https://www.freightracing.ca',
          'http://localhost:5173',
        ]);
        const compatOrigin = COMPAT_ALLOWED.has(origin) ? origin : 'https://freightracing.ca';
        const trackCorsHeaders = {
          'Access-Control-Allow-Origin': compatOrigin,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        };
        if (method === 'OPTIONS') return new Response(null, { status: 204, headers: trackCorsHeaders });
        if (method === 'POST') {
          const body = await request.json() as Record<string, unknown>;
          const cf = (request as Request & { cf?: { city?: string; region?: string } }).cf;
          const enriched = { ...body, city: cf?.city ?? null, region_cf: cf?.region ?? null };
          // /ingest/compat is a protected route in bih-intel-api (requires Bearer
          // token).  Without this Authorization header every compat event silently
          // returns 401 and the dashboard compat tab stays permanently empty.
          const upstream = await fetch('https://intel-api.freightracing.ca/ingest/compat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.INTEL_API_SECRET}`,
            },
            body: JSON.stringify(enriched),
          });
          // Re-wrap response so our CORS headers (not upstream's) reach the browser.
          return new Response(upstream.body, {
            status: upstream.status,
            headers: { 'Content-Type': 'application/json', ...trackCorsHeaders },
          });
        }
        return new Response(null, { status: 405 });
      }

      // ── 静态资源（SPA fallback 由 wrangler.jsonc assets 配置处理）───────────
      return env.ASSETS.fetch(request);
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  },
};
