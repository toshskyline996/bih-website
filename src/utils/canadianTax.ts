/**
 * 加拿大各省税率计算工具
 * 为什么单独模块：税率规则独立于 UI，便于测试和 QuickBooks 同步时复用
 */

export interface ProvinceTaxRate {
  provinceCode: string;
  provinceName: string;
  gst: number;   // 联邦货物服务税
  pst: number;   // 省销售税
  hst: number;   // 协调销售税（替代 GST+PST）
  totalRate: number;
}

export const PROVINCE_TAX_RATES: ProvinceTaxRate[] = [
  { provinceCode: 'AB', provinceName: 'Alberta',                   gst: 0.05, pst: 0,       hst: 0,    totalRate: 0.05 },
  { provinceCode: 'BC', provinceName: 'British Columbia',          gst: 0.05, pst: 0.07,   hst: 0,    totalRate: 0.12 },
  { provinceCode: 'MB', provinceName: 'Manitoba',                  gst: 0.05, pst: 0.07,   hst: 0,    totalRate: 0.12 },
  { provinceCode: 'NB', provinceName: 'New Brunswick',             gst: 0,    pst: 0,       hst: 0.15, totalRate: 0.15 },
  { provinceCode: 'NL', provinceName: 'Newfoundland & Labrador',   gst: 0,    pst: 0,       hst: 0.15, totalRate: 0.15 },
  { provinceCode: 'NS', provinceName: 'Nova Scotia',               gst: 0,    pst: 0,       hst: 0.15, totalRate: 0.15 },
  { provinceCode: 'NT', provinceName: 'Northwest Territories',     gst: 0.05, pst: 0,       hst: 0,    totalRate: 0.05 },
  { provinceCode: 'NU', provinceName: 'Nunavut',                   gst: 0.05, pst: 0,       hst: 0,    totalRate: 0.05 },
  { provinceCode: 'ON', provinceName: 'Ontario',                   gst: 0,    pst: 0,       hst: 0.13, totalRate: 0.13 },
  { provinceCode: 'PE', provinceName: 'Prince Edward Island',      gst: 0,    pst: 0,       hst: 0.15, totalRate: 0.15 },
  { provinceCode: 'QC', provinceName: 'Quebec',                    gst: 0.05, pst: 0.09975, hst: 0,    totalRate: 0.14975 },
  { provinceCode: 'SK', provinceName: 'Saskatchewan',              gst: 0.05, pst: 0.06,   hst: 0,    totalRate: 0.11 },
  { provinceCode: 'YT', provinceName: 'Yukon',                     gst: 0.05, pst: 0,       hst: 0,    totalRate: 0.05 },
];

/**
 * 根据省份代码计算税额
 * @param subtotal 税前小计（CAD）
 * @param provinceCode 省份代码（如 'ON', 'BC'）
 * @returns 税额和税率信息
 */
export function calculateTax(subtotal: number, provinceCode: string): {
  taxAmount: number;
  taxRate: number;
  breakdown: { gst: number; pst: number; hst: number };
} {
  const province = PROVINCE_TAX_RATES.find((p) => p.provinceCode === provinceCode);
  if (!province) {
    // 未知省份默认 5% GST
    return { taxAmount: subtotal * 0.05, taxRate: 0.05, breakdown: { gst: subtotal * 0.05, pst: 0, hst: 0 } };
  }

  const gstAmount = subtotal * province.gst;
  const pstAmount = subtotal * province.pst;
  const hstAmount = subtotal * province.hst;

  return {
    taxAmount: Math.round((gstAmount + pstAmount + hstAmount) * 100) / 100,
    taxRate: province.totalRate,
    breakdown: {
      gst: Math.round(gstAmount * 100) / 100,
      pst: Math.round(pstAmount * 100) / 100,
      hst: Math.round(hstAmount * 100) / 100,
    },
  };
}

export function getProvinceByCode(code: string): ProvinceTaxRate | undefined {
  return PROVINCE_TAX_RATES.find((p) => p.provinceCode === code);
}
