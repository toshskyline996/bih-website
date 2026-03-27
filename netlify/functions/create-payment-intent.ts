/**
 * Netlify Function: 创建 Stripe PaymentIntent
 * 为什么在服务端创建：Stripe secret key 不能暴露在前端
 */
import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { calculateTax } from '../../src/utils/canadianTax';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items, provinceCode, shippingCad, customerEmail } = JSON.parse(event.body || '{}');

    if (!items || !Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'items required' }) };
    }

    // 计算商品小计（单位：CAD）
    const subtotal: number = items.reduce(
      (sum: number, item: { priceCad: number; quantity: number }) =>
        sum + item.priceCad * item.quantity,
      0
    );

    // 计算省税
    const tax = calculateTax(subtotal, provinceCode || 'ON');
    const shippingAmount = shippingCad || 0;
    const totalCad = subtotal + tax.taxAmount + shippingAmount;

    // Stripe 金额单位为分（cents）
    const totalCents = Math.round(totalCad * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'cad',
      receipt_email: customerEmail || undefined,
      metadata: {
        subtotal: subtotal.toFixed(2),
        tax: tax.taxAmount.toFixed(2),
        taxRate: tax.taxRate.toString(),
        shipping: shippingAmount.toFixed(2),
        provinceCode: provinceCode || 'ON',
        itemCount: items.length.toString(),
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        breakdown: {
          subtotal,
          tax: tax.taxAmount,
          taxRate: tax.taxRate,
          taxBreakdown: tax.breakdown,
          shipping: shippingAmount,
          total: totalCad,
        },
      }),
    };
  } catch (err) {
    console.error('[create-payment-intent]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Payment intent creation failed' }),
    };
  }
};
