/**
 * Netlify Function: QuickBooks Online 同步
 *
 * 职责：接收订单数据 → 在 QBO 创建 Sales Receipt（已收款凭证）
 *
 * QBO API 流程：
 * 1. 用 Refresh Token 换取 Access Token（每小时过期，自动刷新）
 * 2. 查找或创建 QBO Customer（按邮箱去重）
 * 3. 查找或创建 "BIH Equipment" Service Item（一次性自动建立）
 * 4. 创建 Sales Receipt（含商品、税、运费明细）
 */
import type { Handler } from '@netlify/functions';

// ─── 环境变量 ────────────────────────────────────────────────────────────────
const QBO_CLIENT_ID     = process.env.QUICKBOOKS_CLIENT_ID!;
const QBO_CLIENT_SECRET = process.env.QUICKBOOKS_CLIENT_SECRET!;
const QBO_REFRESH_TOKEN = process.env.QUICKBOOKS_REFRESH_TOKEN!;
const QBO_REALM_ID      = process.env.QUICKBOOKS_REALM_ID!;

// 生产环境用 production，沙盒用 sandbox
const QBO_BASE = 'https://quickbooks.api.intuit.com';
const TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

// ─── 类型定义 ─────────────────────────────────────────────────────────────────
interface LineItem {
  name: string;
  qty: number;
  unitPrice: number;
}

interface SyncPayload {
  orderId: string;
  customerEmail: string;
  customerName: string;
  lineItems: LineItem[];
  subtotalCad: number;
  taxAmountCad: number;
  taxRate: number;
  shippingCad: number;
  totalCad: number;
  provinceCode: string;
  createdAt: string;
}

// ─── 工具函数：刷新 Access Token ──────────────────────────────────────────────
async function getAccessToken(): Promise<string> {
  // Basic Auth: base64(clientId:clientSecret)
  const credentials = Buffer.from(`${QBO_CLIENT_ID}:${QBO_CLIENT_SECRET}`).toString('base64');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: QBO_REFRESH_TOKEN,
    }).toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token refresh failed (${res.status}): ${err}`);
  }

  const data = await res.json() as { access_token: string };
  return data.access_token;
}

// ─── 工具函数：QBO API 请求封装 ───────────────────────────────────────────────
async function qboRequest(
  accessToken: string,
  method: 'GET' | 'POST',
  path: string,
  body?: object
): Promise<unknown> {
  const url = `${QBO_BASE}/v3/company/${QBO_REALM_ID}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`QBO API ${method} ${path} failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

// ─── 工具函数：QBO Query ──────────────────────────────────────────────────────
async function qboQuery(accessToken: string, sql: string): Promise<{ QueryResponse: Record<string, unknown[]> }> {
  const encoded = encodeURIComponent(sql);
  return qboRequest(accessToken, 'GET', `/query?query=${encoded}&minorversion=65`) as Promise<{ QueryResponse: Record<string, unknown[]> }>;
}

// ─── 查找或创建 QBO Customer ──────────────────────────────────────────────────
async function findOrCreateCustomer(
  accessToken: string,
  email: string,
  displayName: string
): Promise<string> {
  // 按邮箱查找已有客户
  const safeEmail = email.replace(/'/g, "\\'");
  const result = await qboQuery(
    accessToken,
    `SELECT Id FROM Customer WHERE PrimaryEmailAddr = '${safeEmail}' MAXRESULTS 1`
  );

  const customers = result.QueryResponse.Customer as Array<{ Id: string }> | undefined;
  if (customers && customers.length > 0) {
    return customers[0].Id;
  }

  // 不存在则创建
  const created = await qboRequest(accessToken, 'POST', '/customer?minorversion=65', {
    DisplayName: displayName || email,
    PrimaryEmailAddr: { Address: email },
  }) as { Customer: { Id: string } };

  return created.Customer.Id;
}

// ─── 查找或创建 "BIH Equipment" Service Item ─────────────────────────────────
async function findOrCreateItem(accessToken: string): Promise<string> {
  const result = await qboQuery(
    accessToken,
    `SELECT Id FROM Item WHERE Name = 'BIH Equipment' AND Active = true MAXRESULTS 1`
  );

  const items = result.QueryResponse.Item as Array<{ Id: string }> | undefined;
  if (items && items.length > 0) {
    return items[0].Id;
  }

  // 创建通用 Service Item（只需首次）
  const created = await qboRequest(accessToken, 'POST', '/item?minorversion=65', {
    Name: 'BIH Equipment',
    Type: 'Service',
    IncomeAccountRef: { name: 'Sales', value: '79' }, // QBO 默认 Sales income account
  }) as { Item: { Id: string } };

  return created.Item.Id;
}

// ─── 主 Handler ───────────────────────────────────────────────────────────────
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // 环境变量检查
  if (!QBO_CLIENT_ID || !QBO_CLIENT_SECRET || !QBO_REFRESH_TOKEN || !QBO_REALM_ID) {
    console.error('[quickbooks-sync] Missing QBO environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'QuickBooks not configured', details: 'Missing env vars' }),
    };
  }

  let payload: SyncPayload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  try {
    // 1. 获取 Access Token
    const accessToken = await getAccessToken();
    console.log('[quickbooks-sync] Token refreshed ✓');

    // 2. 查找或创建客户
    const customerId = await findOrCreateCustomer(
      accessToken,
      payload.customerEmail,
      payload.customerName
    );
    console.log('[quickbooks-sync] Customer ID:', customerId);

    // 3. 查找或创建商品
    const itemId = await findOrCreateItem(accessToken);
    console.log('[quickbooks-sync] Item ID:', itemId);

    // 4. 构建 Sales Receipt 明细行
    const lines = [
      // 商品明细
      ...payload.lineItems.map((item) => ({
        DetailType: 'SalesItemLineDetail',
        Amount: item.qty * item.unitPrice,
        Description: `${item.name} × ${item.qty}`,
        SalesItemLineDetail: {
          ItemRef: { value: itemId },
          Qty: item.qty,
          UnitPrice: item.unitPrice,
        },
      })),
      // 运费明细（单独一行）
      ...(payload.shippingCad > 0
        ? [{
            DetailType: 'SalesItemLineDetail',
            Amount: payload.shippingCad,
            Description: 'Shipping (Manitoulin Transport)',
            SalesItemLineDetail: {
              ItemRef: { value: itemId },
              Qty: 1,
              UnitPrice: payload.shippingCad,
            },
          }]
        : []),
      // 税额（单独描述行，最简单方式）
      ...(payload.taxAmountCad > 0
        ? [{
            DetailType: 'SalesItemLineDetail',
            Amount: payload.taxAmountCad,
            Description: `${payload.provinceCode} HST/GST (${(payload.taxRate * 100).toFixed(0)}%)`,
            SalesItemLineDetail: {
              ItemRef: { value: itemId },
              Qty: 1,
              UnitPrice: payload.taxAmountCad,
            },
          }]
        : []),
    ];

    // 5. 创建 Sales Receipt
    const receiptBody = {
      Line: lines,
      CustomerRef: { value: customerId },
      BillEmail: { Address: payload.customerEmail },
      GlobalTaxCalculation: 'NotApplicable', // 税已手动加入明细行
      PrivateNote: `Order ID: ${payload.orderId} | Province: ${payload.provinceCode}`,
      TxnDate: payload.createdAt.split('T')[0], // YYYY-MM-DD
    };

    const receipt = await qboRequest(
      accessToken,
      'POST',
      '/salesreceipt?minorversion=65',
      receiptBody
    ) as { SalesReceipt: { Id: string; DocNumber: string } };

    const receiptId = receipt.SalesReceipt.Id;
    const docNumber = receipt.SalesReceipt.DocNumber;

    console.log(`[quickbooks-sync] Sales Receipt created: #${docNumber} (ID: ${receiptId})`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        salesReceiptId: receiptId,
        docNumber,
        customerId,
      }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[quickbooks-sync] Error:', message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'QuickBooks sync failed', details: message }),
    };
  }
};
