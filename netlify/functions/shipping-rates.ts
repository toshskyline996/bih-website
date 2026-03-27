/**
 * Netlify Function: 运费估算（Manitoulin Transport 占位符）
 * 为什么占位符：Manitoulin API token 尚未提供，保留接口结构，token 到位后替换实现即可
 */
import type { Handler } from '@netlify/functions';

interface ShippingRate {
  service: string;
  priceCad: number;
  etaDays: string;
  carrier: string;
}

/**
 * 临时运费估算：基于重量和距离的分档定价
 * 实际接入 Manitoulin API 后，替换此函数体即可
 */
function estimateShippingRate(weightKg: number, provinceCode: string): ShippingRate[] {
  // TODO: 接入 Manitoulin Transport API
  // API 文档: https://manitoulin.com/technology/
  // 所需 token: process.env.MANITOULIN_API_TOKEN

  // 当前：基于重量分档的固定费率（Ontario 基准）
  const BASE_RATES: Record<string, number> = {
    AB: 1.35, BC: 1.40, MB: 1.20, NB: 1.30, NL: 1.50,
    NS: 1.30, NT: 2.00, NU: 2.50, ON: 1.00, PE: 1.35,
    QC: 1.10, SK: 1.25, YT: 2.00,
  };
  const multiplier = BASE_RATES[provinceCode] ?? 1.20;

  // 基础运费：$150 起 + $0.45/kg
  const basePrice = 150 + weightKg * 0.45;
  const adjustedPrice = Math.round(basePrice * multiplier);

  return [
    {
      service: 'Standard LTL Freight',
      priceCad: adjustedPrice,
      etaDays: '5–10 business days',
      carrier: 'Manitoulin Transport (estimate)',
    },
    {
      service: 'Express LTL Freight',
      priceCad: Math.round(adjustedPrice * 1.45),
      etaDays: '2–4 business days',
      carrier: 'Manitoulin Transport (estimate)',
    },
  ];
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { weightKg, provinceCode } = JSON.parse(event.body || '{}');

    if (!weightKg || !provinceCode) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'weightKg and provinceCode required' }),
      };
    }

    const rates = estimateShippingRate(Number(weightKg), String(provinceCode));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rates,
        disclaimer: 'Shipping estimate only. Final rate confirmed at dispatch.',
        isEstimate: true,
      }),
    };
  } catch (err) {
    console.error('[shipping-rates]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Shipping rate calculation failed' }),
    };
  }
};
