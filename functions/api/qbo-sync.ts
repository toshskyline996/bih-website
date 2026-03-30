// Cloudflare Pages Function — QuickBooks Online 订单同步
// 路径: /api/qbo-sync
// 触发时机: Stripe 付款成功后由 OrderSuccessPage 调用
// 在 QBO 创建 Sales Receipt，并在 PrivateNote 中标注 "PENDING REVIEW"

interface Env {
  QUICKBOOKS_CLIENT_ID: string;
  QUICKBOOKS_CLIENT_SECRET: string;
  QUICKBOOKS_REFRESH_TOKEN: string;
  QUICKBOOKS_REALM_ID: string;
}

const QBO_TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
const QBO_BASE_URL  = 'https://quickbooks.api.intuit.com/v3/company';

interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  priceCad: number;
}

interface RequestBody {
  stripePaymentIntentId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  taxName: string;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postal: string;
  };
}

interface QboItem {
  Id: string;
  Name: string;
  Type?: string;
  Active?: boolean;
}

interface QboItemRef {
  value: string;
  name: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body: RequestBody = await request.json();

    if (!env.QUICKBOOKS_CLIENT_ID || !env.QUICKBOOKS_CLIENT_SECRET || !env.QUICKBOOKS_REFRESH_TOKEN || !env.QUICKBOOKS_REALM_ID) {
      throw new Error('Missing QuickBooks runtime configuration');
    }

    if (!body?.stripePaymentIntentId || !body.customer?.email || !body.items?.length || !body.shippingAddress) {
      return Response.json(
        { error: 'Missing required QBO sync payload fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    // ── Step 1: 用 refresh_token 换取新 access_token ────────────────────
    const accessToken = await refreshAccessToken(env);

    // ── Step 2: 查找或创建 QBO 客户 ──────────────────────────────────────
    const customerId = await findOrCreateCustomer(accessToken, env.QUICKBOOKS_REALM_ID, body.customer);

    // ── Step 3: 创建 Sales Receipt ────────────────────────────────────────
    const receipt = await createSalesReceipt(accessToken, env.QUICKBOOKS_REALM_ID, body, customerId);

    return Response.json(
      {
        qboTxnId:    receipt.SalesReceipt.Id,
        qboDocNumber: receipt.SalesReceipt.DocNumber,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    // QBO 同步失败不应阻断用户体验 — 记录日志，返回 partial success
    console.error('qbo-sync error:', err);
    const detail = err instanceof Error ? err.message : 'Unknown QBO sync error';
    return Response.json(
      { error: 'QBO sync failed — order still recorded in Stripe', detail, qboTxnId: null },
      { status: 500, headers: corsHeaders }
    );
  }
};

// ─── QBO OAuth2: 刷新 Access Token ───────────────────────────────────────────
async function refreshAccessToken(env: Env): Promise<string> {
  const credentials = btoa(`${env.QUICKBOOKS_CLIENT_ID}:${env.QUICKBOOKS_CLIENT_SECRET}`);
  const res = await fetch(QBO_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: env.QUICKBOOKS_REFRESH_TOKEN,
    }).toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QBO token refresh failed: ${err}`);
  }

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

// ─── 查找或创建 QBO 客户（按 email） ─────────────────────────────────────────
async function findOrCreateCustomer(
  token: string,
  realmId: string,
  customer: RequestBody['customer']
): Promise<string> {
  const query = encodeURIComponent(
    `SELECT * FROM Customer WHERE PrimaryEmailAddr = '${customer.email}' MAXRESULTS 1`
  );
  const res = await fetch(`${QBO_BASE_URL}/${realmId}/query?query=${query}&minorversion=65`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (res.ok) {
    const data = await res.json() as {
      QueryResponse: { Customer?: { Id: string }[] };
    };
    if (data.QueryResponse?.Customer?.length) {
      return data.QueryResponse.Customer[0].Id;
    }
  }

  // 客户不存在 — 创建新客户
  const createRes = await fetch(`${QBO_BASE_URL}/${realmId}/customer?minorversion=65`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      DisplayName: customer.company ? `${customer.company} — ${customer.name}` : customer.name,
      PrimaryEmailAddr: { Address: customer.email },
      PrimaryPhone: customer.phone ? { FreeFormNumber: customer.phone } : undefined,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`QBO customer creation failed: ${err}`);
  }

  const created = await createRes.json() as { Customer: { Id: string } };

  if (!created.Customer?.Id) {
    throw new Error('QBO customer creation failed: missing Customer Id');
  }

  return created.Customer.Id;
}

async function resolveItemRefs(token: string, realmId: string): Promise<{ salesItemRef: QboItemRef; shippingItemRef: QboItemRef }> {
  const items = await listActiveSellableItems(token, realmId);
  const salesItem = findPreferredItem(items, ['Sales', 'Services']) ?? items[0];
  const shippingItem = findPreferredItem(items, ['Shipping', 'LTL Freight']) ?? salesItem;

  return {
    salesItemRef: { value: salesItem.Id, name: salesItem.Name },
    shippingItemRef: { value: shippingItem.Id, name: shippingItem.Name },
  };
}

async function listActiveSellableItems(token: string, realmId: string): Promise<QboItem[]> {
  const query = encodeURIComponent('SELECT * FROM Item MAXRESULTS 1000');
  const res = await fetch(`${QBO_BASE_URL}/${realmId}/query?query=${query}&minorversion=65`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QBO item lookup failed: ${err}`);
  }

  const data = await res.json() as { QueryResponse?: { Item?: QboItem[] } };
  const items = (data.QueryResponse?.Item ?? []).filter((item) => item.Active !== false && isSellableItem(item));

  if (!items.length) {
    throw new Error('QBO item lookup failed: no active sellable items found in company');
  }

  return items;
}

function isSellableItem(item: QboItem): boolean {
  return item.Type === 'Service' || item.Type === 'NonInventory' || item.Type === 'Inventory';
}

function findPreferredItem(items: QboItem[], names: string[]): QboItem | undefined {
  const normalizedNames = names.map((name) => name.toLowerCase());
  return items.find((item) => normalizedNames.includes(item.Name.toLowerCase()));
}

function buildSalesReceipt(
  body: RequestBody,
  customerId: string,
  salesItemRef: QboItemRef,
  shippingItemRef: QboItemRef,
  options?: { manualTaxLine?: boolean }
) {
  const lines = body.items.map((item, idx) => ({
    Id: String(idx + 1),
    LineNum: idx + 1,
    Amount: item.priceCad * item.qty,
    DetailType: 'SalesItemLineDetail',
    Description: item.name,
    SalesItemLineDetail: {
      Qty: item.qty,
      UnitPrice: item.priceCad,
      ItemRef: salesItemRef,
    },
  }));

  if (body.shipping > 0) {
    lines.push({
      Id: String(lines.length + 1),
      LineNum: lines.length + 1,
      Amount: body.shipping,
      DetailType: 'SalesItemLineDetail',
      Description: 'LTL Freight',
      SalesItemLineDetail: {
        Qty: 1,
        UnitPrice: body.shipping,
        ItemRef: shippingItemRef,
      },
    });
  }

  if (options?.manualTaxLine && body.taxAmount > 0) {
    lines.push({
      Id: String(lines.length + 1),
      LineNum: lines.length + 1,
      Amount: body.taxAmount,
      DetailType: 'SalesItemLineDetail',
      Description: body.taxName,
      SalesItemLineDetail: {
        Qty: 1,
        UnitPrice: body.taxAmount,
        ItemRef: salesItemRef,
      },
    });
  }

  const addr = body.shippingAddress;
  const receipt: {
    BillEmail: { Address: string };
    CustomerMemo: { value: string };
    CustomerRef: { value: string };
    Line: typeof lines;
    PrivateNote: string;
    ShipAddr: {
      City: string;
      Country: string;
      CountrySubDivisionCode: string;
      Line1: string;
      PostalCode: string;
    };
    TxnTaxDetail?: {
      TotalTax: number;
    };
  } = {
    CustomerRef: { value: customerId },
    Line: lines,
    BillEmail: { Address: body.customer.email },
    ShipAddr: {
      Line1: addr.street,
      City: addr.city,
      CountrySubDivisionCode: addr.province,
      PostalCode: addr.postal,
      Country: 'CA',
    },
    PrivateNote: [
      `⚠️ PENDING REVIEW — awaiting manual confirmation before fulfillment`,
      `Stripe PaymentIntent: ${body.stripePaymentIntentId}`,
      `Tax: ${body.taxName} ${(body.taxAmount).toFixed(2)} CAD`,
    ].join('\n'),
    CustomerMemo: { value: 'Thank you for your order. Our team will contact you within 1–2 business days to confirm your order details.' },
  };

  if (!options?.manualTaxLine && body.taxAmount > 0) {
    receipt.TxnTaxDetail = {
      TotalTax: body.taxAmount,
    };
  }

  return receipt;
}

async function postSalesReceipt(token: string, realmId: string, receipt: ReturnType<typeof buildSalesReceipt>) {
  return fetch(`${QBO_BASE_URL}/${realmId}/salesreceipt?minorversion=65`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(receipt),
  });
}

function shouldRetryWithManualTaxLine(errorText: string, taxAmount: number): boolean {
  if (taxAmount <= 0) {
    return false;
  }

  const normalized = errorText.toLowerCase();
  return normalized.includes('tax') || normalized.includes('txntaxdetail') || normalized.includes('taxcode');
}

// ─── 创建 Sales Receipt ────────────────────────────────────────────────────
async function createSalesReceipt(
  token: string,
  realmId: string,
  body: RequestBody,
  customerId: string
): Promise<{ SalesReceipt: { Id: string; DocNumber: string } }> {
  const { salesItemRef, shippingItemRef } = await resolveItemRefs(token, realmId);
  const receipt = buildSalesReceipt(body, customerId, salesItemRef, shippingItemRef);
  const res = await postSalesReceipt(token, realmId, receipt);

  if (!res.ok) {
    const err = await res.text();
    if (shouldRetryWithManualTaxLine(err, body.taxAmount)) {
      const fallbackReceipt = buildSalesReceipt(body, customerId, salesItemRef, shippingItemRef, { manualTaxLine: true });
      const fallbackRes = await postSalesReceipt(token, realmId, fallbackReceipt);
      if (fallbackRes.ok) {
        return fallbackRes.json() as Promise<{ SalesReceipt: { Id: string; DocNumber: string } }>;
      }

      const fallbackErr = await fallbackRes.text();
      throw new Error(`QBO Sales Receipt creation failed: ${err}; fallback failed: ${fallbackErr}`);
    }

    throw new Error(`QBO Sales Receipt creation failed: ${err}`);
  }

  return res.json() as Promise<{ SalesReceipt: { Id: string; DocNumber: string } }>;
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
