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

// Extract unit id from URL path /api/inventory/unit/:id
function extractId(url: URL): string {
  const parts = url.pathname.split('/');
  return parts[parts.length - 1] ?? '';
}

// GET /api/inventory/unit/:id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestGet(ctx: any): Promise<Response> {
  const { request, env } = ctx as { request: Request; env: WorkerEnv };
  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
  }

  const id = extractId(new URL(request.url));
  if (!id) {
    return new Response(JSON.stringify({ error: 'unit id required' }), { status: 400, headers: CORS });
  }

  // Support lookup by UUID or by label_id (BIH-XXXX)
  const unit = await env.INVENTORY_DB.prepare(
    `SELECT u.*, s.name AS sku_name, s.model AS sku_model, s.category AS sku_category
     FROM inventory_units u
     LEFT JOIN inventory_skus s ON s.id = u.sku_id
     WHERE u.id = ? OR u.label_id = ?`
  ).bind(id, id).first();

  if (!unit) {
    return new Response(JSON.stringify({ error: 'Unit not found' }), { status: 404, headers: CORS });
  }

  return new Response(JSON.stringify({ unit }), { headers: CORS });
}

// PATCH /api/inventory/unit/:id
// Body: { status?, location?, notes? }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestPatch(ctx: any): Promise<Response> {
  const { request, env } = ctx as { request: Request; env: WorkerEnv };
  if (!checkAuth(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS });
  }

  const id = extractId(new URL(request.url));
  if (!id) {
    return new Response(JSON.stringify({ error: 'unit id required' }), { status: 400, headers: CORS });
  }

  let body: { status?: string; location?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: CORS });
  }

  const allowed = ['in_stock', 'reserved', 'sold', 'damaged'];
  if (body.status && !allowed.includes(body.status)) {
    return new Response(JSON.stringify({ error: `status must be one of: ${allowed.join(', ')}` }), { status: 400, headers: CORS });
  }

  const setParts: string[] = [];
  const bindings: (string | number | null)[] = [];

  if (body.status !== undefined) {
    setParts.push('status = ?');
    bindings.push(body.status);
    if (body.status === 'sold') { setParts.push('sold_at = unixepoch()'); }
    else { setParts.push('sold_at = NULL'); }
  }
  if (body.location !== undefined) { setParts.push('location = ?'); bindings.push(body.location); }
  if (body.notes !== undefined)    { setParts.push('notes = ?'); bindings.push(body.notes); }

  if (setParts.length === 0) {
    return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400, headers: CORS });
  }

  bindings.push(id);
  const result = await env.INVENTORY_DB.prepare(
    `UPDATE inventory_units SET ${setParts.join(', ')} WHERE id = ? OR label_id = ?`
  ).bind(...bindings, id).run();

  if (result.meta.changes === 0) {
    return new Response(JSON.stringify({ error: 'Unit not found' }), { status: 404, headers: CORS });
  }

  return new Response(JSON.stringify({ ok: true }), { headers: CORS });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestOptions(_ctx: any): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS });
}
