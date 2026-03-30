// Cloudflare Pages Function — Stripe PaymentIntent 创建
// 路径: /api/create-payment-intent
// 安全原则: 所有价格从服务端 PRODUCT_PRICES 表校验，不信任客户端传入的价格

import Stripe from 'stripe';
import { getTaxInfo } from '../../src/app/utils/canadianTax';

interface Env {
  STRIPE_SECRET_KEY: string;
}

// 服务端权威价格表 — 与 products.ts 保持同步
const PRODUCT_PRICES: Record<string, { name: string; priceCad: number }> = {
  'bkt-hd-01':   { name: 'Heavy Duty Excavator Bucket (12–25T)',       priceCad: 3800  },
  'bkt-hd-02':   { name: 'Heavy Duty Excavator Bucket — Large Class',  priceCad: 7200  },
  'bkt-mini-01': { name: 'Mini Excavator Bucket',                       priceCad: 1450  },
  'rak-01':      { name: 'Skeleton Rake Bucket',                        priceCad: 3100  },
  'brk-01':      { name: 'Hydraulic Breaker — Small Class',             priceCad: 5200  },
  'brk-02':      { name: 'Hydraulic Breaker — Medium/Large Class',      priceCad: 11500 },
  'cpl-01':      { name: 'Hydraulic Quick Coupler',                     priceCad: 3200  },
  'thm-01':      { name: 'Hydraulic Thumb',                             priceCad: 2700  },
  'rip-01':      { name: 'Single Shank Ripper',                         priceCad: 2900  },
  'aug-01':      { name: 'Hydraulic Earth Auger Drive Unit',            priceCad: 4200  },
};

interface RequestBody {
  items: { productId: string; qty: number }[];
  shippingCad: number;
  province: string;
  customerEmail: string;
  customerName: string;
  orderNote?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // CORS preflight
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body: RequestBody = await request.json();
    const { items, shippingCad, province, customerEmail, customerName, orderNote } = body;

    if (!items?.length || !province || !customerEmail) {
      return Response.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders });
    }

    // 校验并计算小计 — 使用服务端价格，拒绝客户端价格
    let subtotal = 0;
    const lineDescriptions: string[] = [];
    for (const item of items) {
      const product = PRODUCT_PRICES[item.productId];
      if (!product) {
        return Response.json({ error: `Unknown product: ${item.productId}` }, { status: 400, headers: corsHeaders });
      }
      subtotal += product.priceCad * item.qty;
      lineDescriptions.push(`${product.name} × ${item.qty}`);
    }

    const taxInfo = getTaxInfo(province);
    const taxAmount = Math.round(subtotal * taxInfo.rate * 100) / 100;
    const shipping = Math.max(0, Number(shippingCad) || 0);
    const total = subtotal + taxAmount + shipping;

    // 初始化 Stripe — stripe v17+ 原生支持 Cloudflare Workers
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),  // Stripe 以分为单位
      currency: 'cad',
      receipt_email: customerEmail,
      description: `BIH Order — ${lineDescriptions.join(', ')}`,
      metadata: {
        customerName,
        customerEmail,
        province,
        subtotalCad: subtotal.toFixed(2),
        taxName: taxInfo.taxName,
        taxCad: taxAmount.toFixed(2),
        shippingCad: shipping.toFixed(2),
        totalCad: total.toFixed(2),
        orderNote: orderNote ?? '',
        items: JSON.stringify(items),
        status: 'PENDING_REVIEW',  // 人工审核标记
      },
    });

    return Response.json(
      {
        clientSecret: paymentIntent.client_secret,
        subtotal,
        taxAmount,
        taxName: taxInfo.taxName,
        taxRate: taxInfo.rate,
        shipping,
        total,
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('create-payment-intent error:', msg);
    return Response.json(
      { error: msg },
      { status: 500, headers: corsHeaders }
    );
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
