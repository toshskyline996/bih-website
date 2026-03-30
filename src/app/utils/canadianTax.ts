// 加拿大全13省/地区税率表 — 含 HST / GST+PST / GST only
export interface TaxInfo {
  taxName: string;   // 显示名称，如 "HST", "GST+PST"
  rate: number;      // 小数，如 0.13 = 13%
  gst: number;       // 联邦 GST 部分
  pst: number;       // 省级 PST/QST 部分
}

const TAX_TABLE: Record<string, TaxInfo> = {
  AB: { taxName: 'GST',     rate: 0.05,    gst: 0.05,    pst: 0.00    },
  BC: { taxName: 'GST+PST', rate: 0.12,    gst: 0.05,    pst: 0.07    },
  MB: { taxName: 'GST+PST', rate: 0.12,    gst: 0.05,    pst: 0.07    },
  NB: { taxName: 'HST',     rate: 0.15,    gst: 0.15,    pst: 0.00    },
  NL: { taxName: 'HST',     rate: 0.15,    gst: 0.15,    pst: 0.00    },
  NS: { taxName: 'HST',     rate: 0.15,    gst: 0.15,    pst: 0.00    },
  NT: { taxName: 'GST',     rate: 0.05,    gst: 0.05,    pst: 0.00    },
  NU: { taxName: 'GST',     rate: 0.05,    gst: 0.05,    pst: 0.00    },
  ON: { taxName: 'HST',     rate: 0.13,    gst: 0.13,    pst: 0.00    },
  PE: { taxName: 'HST',     rate: 0.15,    gst: 0.15,    pst: 0.00    },
  QC: { taxName: 'GST+QST', rate: 0.14975, gst: 0.05,    pst: 0.09975 },
  SK: { taxName: 'GST+PST', rate: 0.11,    gst: 0.05,    pst: 0.06    },
  YT: { taxName: 'GST',     rate: 0.05,    gst: 0.05,    pst: 0.00    },
};

export function getTaxInfo(province: string): TaxInfo {
  return TAX_TABLE[province.toUpperCase()] ?? TAX_TABLE['ON'];
}

export function calculateTax(subtotalCad: number, province: string): number {
  return Math.round(subtotalCad * getTaxInfo(province).rate * 100) / 100;
}

export const PROVINCE_OPTIONS = [
  { code: 'AB', label: 'Alberta' },
  { code: 'BC', label: 'British Columbia' },
  { code: 'MB', label: 'Manitoba' },
  { code: 'NB', label: 'New Brunswick' },
  { code: 'NL', label: 'Newfoundland & Labrador' },
  { code: 'NS', label: 'Nova Scotia' },
  { code: 'NT', label: 'Northwest Territories' },
  { code: 'NU', label: 'Nunavut' },
  { code: 'ON', label: 'Ontario' },
  { code: 'PE', label: 'Prince Edward Island' },
  { code: 'QC', label: 'Québec' },
  { code: 'SK', label: 'Saskatchewan' },
  { code: 'YT', label: 'Yukon' },
] as const;
