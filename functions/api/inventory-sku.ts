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

function randomId(): string {
  return crypto.randomUUID();
}

// GET /api/inventory/sku — list all SKUs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestGet(ctx: any): Promise<Response> {
  const { request, env } = ctx as { request: Request; env: WorkerEnv };
  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
  }

  const { results } = await env.INVENTORY_DB.prepare(
    `SELECT s.*, COUNT(u.id) AS unit_count,
            SUM(CASE WHEN u.status = 'in_stock' THEN 1 ELSE 0 END) AS in_stock_count
     FROM inventory_skus s
     LEFT JOIN inventory_units u ON u.sku_id = s.id
     GROUP BY s.id
     ORDER BY s.created_at DESC`
  ).all();

  return new Response(JSON.stringify({ skus: results }), { headers: CORS });
}

// POST /api/inventory/sku — create new SKU
// Body: { name, model?, category?, notes? }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestPost(ctx: any): Promise<Response> {
  const { request, env } = ctx as { request: Request; env: WorkerEnv };
  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
  }

  let body: { name?: string; model?: string; category?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: CORS });
  }

  if (!body.name?.trim()) {
    return new Response(JSON.stringify({ error: 'name is required' }), { status: 400, headers: CORS });
  }

  const id = randomId();
  await env.INVENTORY_DB.prepare(
    `INSERT INTO inventory_skus (id, name, model, category, notes) VALUES (?, ?, ?, ?, ?)`
  ).bind(id, body.name.trim(), body.model ?? null, body.category ?? null, body.notes ?? null).run();

  return new Response(JSON.stringify({ ok: true, id }), { status: 201, headers: CORS });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestOptions(_ctx: any): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS });
}
