/// <reference types="@cloudflare/workers-types" />
// worker.ts — Cloudflare Workers + Assets 模式入口
// 作用: 将 /api/* 请求路由到对应处理函数，其余请求交给静态资源服务
// 背景: wrangler.jsonc 中配置了 "assets"，使项目以 Workers+Assets 模式部署
//       该模式下 functions/ 目录不会被自动识别，需要此文件手动桥接

import { onRequestPost as shippingPost, onRequestOptions as shippingOpts } from './functions/api/shipping-rates';
import { onRequestPost as paymentPost, onRequestOptions as paymentOpts } from './functions/api/create-payment-intent';
import { onRequestPost as qboPost, onRequestOptions as qboOpts } from './functions/api/qbo-sync';
import { onRequestPost as webhookPost, onRequestOptions as webhookOpts } from './functions/api/stripe-webhook';

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
}

// Pacific bounding box split into two halves to avoid dateline crossing
// West half: China coast + Western Pacific | East half: Eastern Pacific → BC
const OPENSKY_BBOXES = [
  'lamin=28&lomin=118&lamax=62&lomax=180',   // China coast → dateline
  'lamin=28&lomin=-180&lamax=62&lomax=-120', // dateline → BC coast
];

async function handleFlightsProxy(env: WorkerEnv): Promise<Response> {
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
      if (r1.status === 429) return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), { status: 429, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
      return new Response(JSON.stringify({ ok: false, error: `opensky_${r1.status}` }), { status: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    const parseStates = (raw: { time: number; states: unknown[][] | null }) =>
      (raw.states ?? []).map((s: unknown[]) => ({
        icao24:    s[0],
        callsign:  (s[1] as string)?.trim() || null,
        lon:       s[5],
        lat:       s[6],
        velocity:  s[9],
        heading:   s[10],
        on_ground: s[8],
      })).filter(s => s.lat != null && s.lon != null);

    const [d1, d2] = await Promise.all([
      r1.ok ? r1.json() as Promise<{ time: number; states: unknown[][] | null }> : Promise.resolve({ time: 0, states: null }),
      r2.ok ? r2.json() as Promise<{ time: number; states: unknown[][] | null }> : Promise.resolve({ time: 0, states: null }),
    ]);

    const states = [...parseStates(d1), ...parseStates(d2)];
    return new Response(JSON.stringify({ ok: true, time: d1.time || d2.time, states }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
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

      // ── 静态资源（SPA fallback 由 wrangler.jsonc assets 配置处理）───────────
      return env.ASSETS.fetch(request);
    } catch {
      return new Response('Not Found', { status: 404 });
    }
  },
};
