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

// POST /api/inventory/scan-out
// Body: { unit_id } — unit_id is the UUID (QR code content)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestPost(ctx: any): Promise<Response> {
  const { request, env } = ctx as { request: Request; env: WorkerEnv };
  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
  }

  let body: { unit_id?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: CORS });
  }

  if (!body.unit_id) {
    return new Response(JSON.stringify({ error: 'unit_id is required' }), { status: 400, headers: CORS });
  }

  // Fetch unit with SKU info
  const unit = await env.INVENTORY_DB.prepare(
    `SELECT u.*, s.name AS sku_name, s.model AS sku_model
     FROM inventory_units u
     LEFT JOIN inventory_skus s ON s.id = u.sku_id
     WHERE u.id = ?`
  ).bind(body.unit_id).first<Record<string, unknown>>();

  if (!unit) {
    return new Response(JSON.stringify({ error: 'Unit not found' }), { status: 404, headers: CORS });
  }

  if (unit.status !== 'in_stock' && unit.status !== 'reserved') {
    return new Response(
      JSON.stringify({ error: `Cannot scan out: unit is currently "${unit.status}"`, unit }),
      { status: 409, headers: CORS }
    );
  }

  await env.INVENTORY_DB.prepare(
    `UPDATE inventory_units SET status = 'sold', sold_at = unixepoch() WHERE id = ?`
  ).bind(body.unit_id).run();

  return new Response(JSON.stringify({ ok: true, unit: { ...unit, status: 'sold' } }), { headers: CORS });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestOptions(_ctx: any): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS });
}
