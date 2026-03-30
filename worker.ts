/// <reference types="@cloudflare/workers-types" />
// worker.ts — Cloudflare Workers + Assets 模式入口
// 作用: 将 /api/* 请求路由到对应处理函数，其余请求交给静态资源服务
// 背景: wrangler.jsonc 中配置了 "assets"，使项目以 Workers+Assets 模式部署
//       该模式下 functions/ 目录不会被自动识别，需要此文件手动桥接

import { onRequestPost as shippingPost, onRequestOptions as shippingOpts } from './functions/api/shipping-rates';
import { onRequestPost as paymentPost, onRequestOptions as paymentOpts } from './functions/api/create-payment-intent';
import { onRequestPost as qboPost, onRequestOptions as qboOpts } from './functions/api/qbo-sync';

export interface WorkerEnv {
  ASSETS: Fetcher;
  STRIPE_SECRET_KEY: string;
  QUICKBOOKS_CLIENT_ID: string;
  QUICKBOOKS_CLIENT_SECRET: string;
  QUICKBOOKS_REFRESH_TOKEN: string;
  QUICKBOOKS_REALM_ID: string;
  MANITOULIN_API_TOKEN?: string;
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

export default {
  async fetch(request: Request, env: WorkerEnv, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);
    const method = request.method;
    const c = toCtx(request, env, ctx);

    // ── API 路由 ──────────────────────────────────────────────────────────────
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

    // ── 静态资源（SPA fallback 由 wrangler.jsonc assets 配置处理）─────────────
    return env.ASSETS.fetch(request);
  },
};
