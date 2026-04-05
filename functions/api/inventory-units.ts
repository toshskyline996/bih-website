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

// GET /api/inventory/units?status=&sku_id=&limit=&offset=
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestGet(ctx: any): Promise<Response> {
  const { request, env } = ctx as { request: Request; env: WorkerEnv };
  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
  }

  const url = new URL(request.url);
  const status   = url.searchParams.get('status') ?? '';
  const skuId    = url.searchParams.get('sku_id') ?? '';
  const limit    = Math.min(parseInt(url.searchParams.get('limit') ?? '100'), 500);
  const offset   = parseInt(url.searchParams.get('offset') ?? '0');

  let sql = `
    SELECT u.*, s.name AS sku_name, s.model AS sku_model, s.category AS sku_category
    FROM inventory_units u
    LEFT JOIN inventory_skus s ON s.id = u.sku_id
    WHERE 1=1
  `;
  const bindings: (string | number)[] = [];

  if (status) { sql += ' AND u.status = ?'; bindings.push(status); }
  if (skuId)  { sql += ' AND u.sku_id = ?'; bindings.push(skuId); }

  sql += ' ORDER BY u.arrived_at DESC LIMIT ? OFFSET ?';
  bindings.push(limit, offset);

  const { results } = await env.INVENTORY_DB.prepare(sql).bind(...bindings).all();

  return new Response(JSON.stringify({ units: results, limit, offset }), { headers: CORS });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestOptions(_ctx: any): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS });
}
