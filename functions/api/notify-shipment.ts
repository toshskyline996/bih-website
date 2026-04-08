/// <reference types="@cloudflare/workers-types" />
// functions/api/notify-shipment.ts
// 货柜发货通知 API — 由 FreightRacing 调用，向客人发送追踪邮件
// 依赖: Resend (发邮件) + D1 (存记录)

export interface WorkerEnv {
  ASSETS: Fetcher
  RESEND_API_KEY: string
  SHIPMENT_DB: D1Database
  // 现有环境变量（保持兼容）
  STRIPE_SECRET_KEY: string
  QUICKBOOKS_CLIENT_ID: string
  QUICKBOOKS_CLIENT_SECRET: string
  QUICKBOOKS_REFRESH_TOKEN: string
  QUICKBOOKS_REALM_ID: string
  STRIPE_WEBHOOK_SECRET: string
  QUICKBOOKS_SANDBOX?: string
  MANITOULIN_API_TOKEN?: string
  FREIGHT_API_SECRET: string // FreightRacing 调用此接口的共享密钥
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://freightracing.ca',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// 各承运商追踪链接模板
const CARRIER_TRACK_URLS: Record<string, string> = {
  MSC: 'https://www.msc.com/en/track-a-shipment?agencyPath=can&link=CONTAINER_NUMBER',
  MAERSK: 'https://www.maersk.com/tracking/CONTAINER_NUMBER',
  COSCO: 'https://elines.coscoshipping.com/ebtracking/waybill?waybillNo=CONTAINER_NUMBER',
  OOCL: 'https://www.oocl.com/eng/ourservices/eservices/cargotracking/Pages/cargotracking.aspx?CONTAINER=CONTAINER_NUMBER',
  EVERGREEN: 'https://ct.evergreen-line.com/tdetail.aspx?blno=CONTAINER_NUMBER',
  'YANG MING': 'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?btnSearch=&Number=CONTAINER_NUMBER',
  CMA: 'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=BL&Reference=CONTAINER_NUMBER',
  HAPAG: 'https://www.hapag-lloyd.com/en/online-business/track/track-by-container-solution.html?container=CONTAINER_NUMBER',
  OTHER: 'https://shipsgo.com/track/CONTAINER_NUMBER',
}

function getTrackingUrl(carrier: string, containerNumber: string): string {
  const key = Object.keys(CARRIER_TRACK_URLS).find(k =>
    carrier.toUpperCase().includes(k)
  ) || 'OTHER'
  return CARRIER_TRACK_URLS[key].replace('CONTAINER_NUMBER', containerNumber)
}

function buildEmailHtml(data: {
  orderNumber: string
  containerNumber: string
  carrier: string
  origin: string
  destination: string
  etaDate: string
  trackingUrl: string
  customerName: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipment Update — Boreal Iron Heavy</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">

          <!-- Header -->
          <tr>
            <td style="background:#1c1c1c;padding:32px 40px;border-bottom:3px solid #f5a623;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:22px;font-weight:800;color:#f5a623;letter-spacing:2px;">BOREAL IRON HEAVY</div>
                    <div style="font-size:12px;color:#888;margin-top:4px;letter-spacing:1px;">INDUSTRIAL EQUIPMENT SUPPLY</div>
                  </td>
                  <td align="right">
                    <div style="background:#f5a623;color:#000;padding:8px 16px;border-radius:6px;font-weight:700;font-size:13px;">
                      🚢 SHIPMENT UPDATE
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#ccc;font-size:16px;margin:0 0 8px;">Hello ${data.customerName},</p>
              <p style="color:#888;font-size:14px;margin:0 0 32px;line-height:1.6;">
                Your order has been loaded and is now in transit. Below are your shipment details.
              </p>

              <!-- Order Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#242424;border-radius:8px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #333;">
                    <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Order Number</span><br>
                    <span style="color:#f5a623;font-size:18px;font-weight:700;">${data.orderNumber}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #333;">
                    <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Container Number</span><br>
                    <span style="color:#fff;font-size:16px;font-weight:600;font-family:monospace;">${data.containerNumber}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #333;">
                    <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Carrier</span><br>
                    <span style="color:#fff;font-size:15px;">${data.carrier}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;border-bottom:1px solid #333;">
                    <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Route</span><br>
                    <span style="color:#fff;font-size:15px;">${data.origin} → ${data.destination}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;">
                    <span style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Estimated Arrival</span><br>
                    <span style="color:#4ade80;font-size:15px;font-weight:600;">${data.etaDate}</span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${data.trackingUrl}" target="_blank"
                       style="display:inline-block;background:#f5a623;color:#000;padding:16px 40px;border-radius:8px;font-weight:700;font-size:15px;text-decoration:none;letter-spacing:0.5px;">
                      📦 Track Your Shipment →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#555;font-size:12px;margin:32px 0 0;text-align:center;line-height:1.6;">
                Questions? Reply to this email or contact us at<br>
                <a href="mailto:info@borealironheavy.ca" style="color:#f5a623;">info@borealironheavy.ca</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111;padding:20px 40px;border-top:1px solid #2a2a2a;">
              <p style="color:#444;font-size:11px;margin:0;text-align:center;">
                © 2026 Boreal Iron Heavy — borealironheavy.ca<br>
                Q355 Manganese Steel Industrial Equipment | Yantai, Shandong → Canada
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function onRequestPost(ctx: { request: Request; env: WorkerEnv }) {
  const { request, env } = ctx

  // 验证调用方身份（FreightRacing 共享密钥）
  const authHeader = request.headers.get('Authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  if (!env.FREIGHT_API_SECRET || token !== env.FREIGHT_API_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  let body: {
    orderNumber: string
    containerNumber: string
    carrier: string
    origin: string
    destination: string
    etaDate: string
    customerEmail: string
    customerName: string
    notes?: string
  }

  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  const {
    orderNumber, containerNumber, carrier,
    origin, destination, etaDate,
    customerEmail, customerName, notes = ''
  } = body

  if (!orderNumber || !containerNumber || !carrier || !customerEmail) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  const trackingUrl = getTrackingUrl(carrier, containerNumber)

  // 1. 存入 D1 数据库
  try {
    await env.SHIPMENT_DB.prepare(`
      INSERT INTO shipments (order_number, container_number, carrier, origin, destination, eta_date, customer_email, customer_name, tracking_url, notes, notified_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(orderNumber, containerNumber, carrier, origin, destination, etaDate, customerEmail, customerName, trackingUrl, notes).run()
  } catch (dbErr) {
    console.error('D1 insert error:', dbErr)
    // D1 错误不阻断发邮件
  }

  // 2. 用 Resend 发邮件
  const emailHtml = buildEmailHtml({
    orderNumber, containerNumber, carrier,
    origin, destination, etaDate,
    trackingUrl, customerName,
  })

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Boreal Iron Heavy <shipping@borealironheavy.ca>',
      to: [customerEmail],
      subject: `Your Order ${orderNumber} Is On Its Way 🚢`,
      html: emailHtml,
    }),
  })

  if (!resendRes.ok) {
    const errBody = await resendRes.text()
    console.error('Resend error:', errBody)
    return new Response(JSON.stringify({ error: 'Email send failed', detail: errBody }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }

  const resendData = await resendRes.json() as { id: string }

  return new Response(JSON.stringify({
    success: true,
    emailId: resendData.id,
    trackingUrl,
    message: `Notification sent to ${customerEmail}`,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}
