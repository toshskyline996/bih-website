// Cloudflare Pages Function — LTL 运费估算
// 路径: /api/shipping-rates
// 逻辑: 优先调用 Manitoulin MT Direct API；未配置 token 时降级到省份固定费率表

interface Env {
  MANITOULIN_API_TOKEN?: string;  // 可选，向 Manitoulin 申请后配置
}

// 产品重量表 (kg) — 与 products.ts 同步
const PRODUCT_WEIGHTS: Record<string, number> = {
  'bkt-hd-01':   750,
  'bkt-hd-02':   2000,
  'bkt-mini-01': 120,
  'rak-01':      600,
  'brk-01':      380,
  'brk-02':      1500,
  'cpl-01':      330,
  'thm-01':      250,
  'rip-01':      625,
  'aug-01':      400,
};

// 省份 LTL 基础运费 (CAD) — 从安大略省发货的估算值
// 数据来源: Manitoulin 公开报价单 / 行业经验
const PROVINCE_BASE: Record<string, number> = {
  ON: 160,
  QC: 195,
  MB: 230,
  SK: 290,
  AB: 340,
  BC: 400,
  NB: 255,
  NS: 275,
  NL: 320,
  PE: 295,
  NT: 520,
  NU: 650,
  YT: 520,
};

const KG_SURCHARGE = 0.75;   // $0.75/kg，超过 100kg 部分
const MINIMUM_CHARGE = 150;  // 最低起运费

interface RequestBody {
  items: { productId: string; qty: number }[];
  destinationProvince: string;
  destinationPostal?: string;   // 预留 Manitoulin API 精确报价用
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body: RequestBody = await request.json();
    const { items, destinationProvince, destinationPostal } = body;

    if (!items?.length || !destinationProvince) {
      return Response.json({ error: 'Missing items or province' }, { status: 400, headers: corsHeaders });
    }

    // 计算总重量
    let totalWeightKg = 0;
    for (const item of items) {
      const weight = PRODUCT_WEIGHTS[item.productId] ?? 200;
      totalWeightKg += weight * item.qty;
    }

    // ── 尝试 Manitoulin MT Direct API ─────────────────────────────────────
    if (env.MANITOULIN_API_TOKEN && destinationPostal) {
      try {
        const manitoulinRate = await fetchManitoulinRate({
          token: env.MANITOULIN_API_TOKEN,
          totalWeightKg,
          destinationPostal,
          destinationProvince,
        });
        if (manitoulinRate !== null) {
          return Response.json(
            {
              rates: [{ service: 'Manitoulin LTL', transitDays: getTransitDays(destinationProvince), priceCad: manitoulinRate, source: 'manitoulin' }],
              totalWeightKg,
            },
            { headers: corsHeaders }
          );
        }
      } catch {
        // Manitoulin API 失败时静默降级到估算值
      }
    }

    // ── 省份估算兜底 ──────────────────────────────────────────────────────
    const base = PROVINCE_BASE[destinationProvince.toUpperCase()] ?? PROVINCE_BASE['ON'];
    const weightSurcharge = totalWeightKg > 100 ? (totalWeightKg - 100) * KG_SURCHARGE : 0;
    const estimated = Math.max(MINIMUM_CHARGE, Math.round(base + weightSurcharge));

    return Response.json(
      {
        rates: [
          {
            service: 'Estimated LTL Freight',
            transitDays: getTransitDays(destinationProvince),
            priceCad: estimated,
            source: 'estimate',
          },
        ],
        totalWeightKg,
        note: 'Estimate only. Final rate confirmed at time of shipment.',
      },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error('shipping-rates error:', err);
    return Response.json({ error: 'Shipping calculation failed' }, { status: 500, headers: corsHeaders });
  }
};

// ─── Manitoulin MT Direct API 集成（占位实现，凭证到位后填充）──────────────
async function fetchManitoulinRate(opts: {
  token: string;
  totalWeightKg: number;
  destinationPostal: string;
  destinationProvince: string;
}): Promise<number | null> {
  // TODO: 向 Manitoulin 销售团队申请 MT Direct API 凭证后实现
  // 参考: https://www.mtdirect.ca/documents/apis/bol/10
  // 典型端点: POST https://www.mtdirect.ca/api/v2/ratequote
  // 需要: originPostal(L1H4L3), destPostal, weight, dims, accountNo
  void opts;
  return null;
}

function getTransitDays(province: string): number {
  const days: Record<string, number> = {
    ON: 2, QC: 3, MB: 4, SK: 5, AB: 5, BC: 6,
    NB: 4, NS: 5, NL: 6, PE: 5, NT: 10, NU: 14, YT: 10,
  };
  return days[province.toUpperCase()] ?? 5;
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
