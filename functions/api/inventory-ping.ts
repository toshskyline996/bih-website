import type { WorkerEnv } from '../../worker';

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function checkAuth(request: Request, env: WorkerEnv): boolean {
  const header = request.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return token.length > 0 && token === env.INVENTORY_ADMIN_SECRET;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestGet(ctx: any): Promise<Response> {
  const { request, env } = ctx as { request: Request; env: WorkerEnv };
  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
  }
  return new Response(JSON.stringify({ ok: true }), { headers: CORS });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestOptions(_ctx: any): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS });
}
