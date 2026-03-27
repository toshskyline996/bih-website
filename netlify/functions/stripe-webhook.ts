/**
 * Netlify Function: Stripe Webhook 接收器
 *
 * 职责：验证 Stripe 签名 → 解析 payment_intent.succeeded 事件
 *       → 调用 quickbooks-sync 创建 QBO Sales Receipt
 *
 * 为什么验签很重要：任何人都可以伪造 POST 到这个 URL，
 * Stripe-Signature header + STRIPE_WEBHOOK_SECRET 可以验证来源真实性
 */
import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[stripe-webhook] Missing signature or webhook secret');
    return { statusCode: 400, body: 'Missing stripe-signature or STRIPE_WEBHOOK_SECRET' };
  }

  // Stripe 验签需要原始 body（非解析后的 JSON）
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf-8')
    : event.body || '';

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err);
    return { statusCode: 400, body: `Webhook signature verification failed` };
  }

  // 只处理支付成功事件
  if (stripeEvent.type !== 'payment_intent.succeeded') {
    return { statusCode: 200, body: JSON.stringify({ received: true, skipped: true }) };
  }

  const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
  const meta = paymentIntent.metadata;

  console.log('[stripe-webhook] payment_intent.succeeded:', paymentIntent.id);

  // 构建 quickbooks-sync 请求体
  let lineItems: { name: string; qty: number; unitPrice: number }[] = [];
  try {
    lineItems = JSON.parse(meta.itemsJson || '[]');
  } catch {
    console.warn('[stripe-webhook] Could not parse itemsJson from metadata');
    lineItems = [{ name: 'Heavy Equipment Attachment', qty: 1, unitPrice: parseFloat(meta.subtotal || '0') }];
  }

  const syncPayload = {
    orderId: paymentIntent.id,
    customerEmail: meta.customerEmail || paymentIntent.receipt_email || '',
    customerName: meta.customerName || 'BIH Customer',
    lineItems,
    subtotalCad: parseFloat(meta.subtotal || '0'),
    taxAmountCad: parseFloat(meta.tax || '0'),
    taxRate: parseFloat(meta.taxRate || '0.13'),
    shippingCad: parseFloat(meta.shipping || '0'),
    totalCad: paymentIntent.amount / 100, // 转回 CAD
    provinceCode: meta.provinceCode || 'ON',
    createdAt: new Date().toISOString(),
  };

  // 异步调用 quickbooks-sync（Fire and forget — Stripe 要求 2 秒内响应）
  // 使用 waitUntil 替代方案：直接 await 但加超时保护
  try {
    const qboUrl = process.env.URL
      ? `${process.env.URL}/.netlify/functions/quickbooks-sync`
      : 'http://localhost:8888/.netlify/functions/quickbooks-sync';

    const qboRes = await Promise.race([
      fetch(qboUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncPayload),
      }),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('QBO sync timeout')), 8000)
      ),
    ]);

    if (!(qboRes as Response).ok) {
      const errText = await (qboRes as Response).text();
      console.error('[stripe-webhook] QBO sync failed:', errText);
    } else {
      const result = await (qboRes as Response).json();
      console.log('[stripe-webhook] QBO sync success:', result);
    }
  } catch (err) {
    // QBO 同步失败不阻断 Stripe 响应（避免 Stripe 重试）
    console.error('[stripe-webhook] QBO sync error (non-fatal):', err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
