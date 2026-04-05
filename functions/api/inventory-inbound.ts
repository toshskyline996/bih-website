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

interface InboundBody {
  sku_id: string;
  quantity: number;
  location?: string;
  cost_cad?: number;
  notes?: string;
}

// POST /api/inventory/inbound
// Body: { sku_id, quantity, location?, cost_cad?, notes? }
// Returns: { ok, units: [{ id, label_id }] }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestPost(ctx: any): Promise<Response> {
  const { request, env } = ctx as { request: Request; env: WorkerEnv };
  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
  }

  let body: InboundBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: CORS });
  }

  if (!body.sku_id) {
    return new Response(JSON.stringify({ error: 'sku_id is required' }), { status: 400, headers: CORS });
  }
  const qty = Math.max(1, Math.min(parseInt(String(body.quantity ?? 1)), 200));

  // Verify SKU exists
  const sku = await env.INVENTORY_DB.prepare('SELECT id FROM inventory_skus WHERE id = ?').bind(body.sku_id).first();
  if (!sku) {
    return new Response(JSON.stringify({ error: 'SKU not found' }), { status: 404, headers: CORS });
  }

  // Get current max label number to continue sequence
  const maxRow = await env.INVENTORY_DB.prepare(
    `SELECT label_id FROM inventory_units ORDER BY arrived_at DESC, label_id DESC LIMIT 1`
  ).first<{ label_id: string }>();

  let nextNum = 1;
  if (maxRow?.label_id) {
    const match = maxRow.label_id.match(/(\d+)$/);
    if (match) nextNum = parseInt(match[1]) + 1;
  }

  const generated: { id: string; label_id: string }[] = [];

  // Batch insert using a prepared statement
  const stmt = env.INVENTORY_DB.prepare(
    `INSERT INTO inventory_units (id, sku_id, label_id, status, location, cost_cad, notes)
     VALUES (?, ?, ?, 'in_stock', ?, ?, ?)`
  );

  const stmts = [];
  for (let i = 0; i < qty; i++) {
    const id = crypto.randomUUID();
    const label_id = `BIH-${String(nextNum + i).padStart(4, '0')}`;
    generated.push({ id, label_id });
    stmts.push(stmt.bind(
      id,
      body.sku_id,
      label_id,
      body.location ?? 'main',
      body.cost_cad ?? null,
      body.notes ?? null,
    ));
  }

  await env.INVENTORY_DB.batch(stmts);

  return new Response(JSON.stringify({ ok: true, units: generated }), { status: 201, headers: CORS });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestOptions(_ctx: any): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS });
}
