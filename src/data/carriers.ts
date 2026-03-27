/**
 * 载体品牌 & 型号适配数据库
 * 
 * 数据来源：各品牌官网规格表 + Big Parts LLC Pin Size Chart 2018
 * pin 尺寸单位：mm，pin center 单位：mm
 * 
 * 业务意图：客户选择自己的载具后，一目了然看到 BIH 属具的适配性
 */

export interface CarrierModel {
  model: string;
  tonnageClass: TonnageClass;
  operatingWeight: string;       // 工作重量范围
  pinDiameter: number;           // 销轴直径 mm
  pinCenter: number;             // 销轴中心距 mm
  stickWidth: number;            // 斗杆宽度 mm
}

export type TonnageClass = 'mini' | 'small' | 'medium' | 'large' | 'heavy';

export interface CarrierBrand {
  id: string;
  name: string;
  logo?: string;                 // 占位：品牌 logo URL
  models: CarrierModel[];
}

/* 吨位区间定义 */
export const tonnageClasses: Record<TonnageClass, { label: string; range: string; min: number; max: number }> = {
  mini:   { label: 'Mini',   range: '1–5T',   min: 1,  max: 5 },
  small:  { label: 'Small',  range: '5–12T',  min: 5,  max: 12 },
  medium: { label: 'Medium', range: '12–25T', min: 12, max: 25 },
  large:  { label: 'Large',  range: '25–50T', min: 25, max: 50 },
  heavy:  { label: 'Heavy',  range: '50–80T', min: 50, max: 80 },
};

/* ============================================
   载体品牌数据（7 个主要品牌）
   pin 数据来自官方规格表和行业标准图表
   ============================================ */

export const carriers: CarrierBrand[] = [
  {
    id: 'cat',
    name: 'Caterpillar (CAT)',
    models: [
      { model: '301.5', tonnageClass: 'mini', operatingWeight: '1.5T', pinDiameter: 30, pinCenter: 115, stickWidth: 105 },
      { model: '302.5', tonnageClass: 'mini', operatingWeight: '2.5T', pinDiameter: 35, pinCenter: 165, stickWidth: 135 },
      { model: '303.5', tonnageClass: 'mini', operatingWeight: '3.5T', pinDiameter: 40, pinCenter: 200, stickWidth: 136 },
      { model: '304.5 / 305CR', tonnageClass: 'small', operatingWeight: '4.5–5T', pinDiameter: 45, pinCenter: 260, stickWidth: 156 },
      { model: '306 / 307', tonnageClass: 'small', operatingWeight: '6–7T', pinDiameter: 45, pinCenter: 306, stickWidth: 186 },
      { model: '308', tonnageClass: 'small', operatingWeight: '8–10T', pinDiameter: 50, pinCenter: 305, stickWidth: 186 },
      { model: '311 / 312 / 313', tonnageClass: 'medium', operatingWeight: '11–15T', pinDiameter: 65, pinCenter: 407, stickWidth: 221 },
      { model: '315', tonnageClass: 'medium', operatingWeight: '15–17T', pinDiameter: 70, pinCenter: 463, stickWidth: 280 },
      { model: '320', tonnageClass: 'medium', operatingWeight: '20–22T', pinDiameter: 80, pinCenter: 445, stickWidth: 311 },
      { model: '324 / 325 / 329', tonnageClass: 'large', operatingWeight: '24–30T', pinDiameter: 90, pinCenter: 485, stickWidth: 351 },
      { model: '330 / 336', tonnageClass: 'large', operatingWeight: '30–36T', pinDiameter: 90, pinCenter: 500, stickWidth: 385 },
      { model: '345 / 349 / 352', tonnageClass: 'large', operatingWeight: '45–52T', pinDiameter: 100, pinCenter: 587, stickWidth: 441 },
      { model: '374 / 390', tonnageClass: 'heavy', operatingWeight: '70–90T', pinDiameter: 130, pinCenter: 585, stickWidth: 551 },
    ],
  },
  {
    id: 'john-deere',
    name: 'John Deere',
    models: [
      { model: '26G / 30G / 35G', tonnageClass: 'mini', operatingWeight: '2.5–3.5T', pinDiameter: 35, pinCenter: 152, stickWidth: 127 },
      { model: '50G / 60G', tonnageClass: 'small', operatingWeight: '5–6T', pinDiameter: 45, pinCenter: 229, stickWidth: 152 },
      { model: '75G / 85G', tonnageClass: 'small', operatingWeight: '7.5–8.5T', pinDiameter: 50, pinCenter: 254, stickWidth: 178 },
      { model: '130G / 135G', tonnageClass: 'medium', operatingWeight: '13–14T', pinDiameter: 65, pinCenter: 356, stickWidth: 229 },
      { model: '160G LC', tonnageClass: 'medium', operatingWeight: '16–18T', pinDiameter: 70, pinCenter: 400, stickWidth: 254 },
      { model: '200D / 210G', tonnageClass: 'medium', operatingWeight: '20–22T', pinDiameter: 80, pinCenter: 472, stickWidth: 305 },
      { model: '250G / 300G', tonnageClass: 'large', operatingWeight: '25–30T', pinDiameter: 80, pinCenter: 472, stickWidth: 305 },
      { model: '345G / 350G', tonnageClass: 'large', operatingWeight: '35–40T', pinDiameter: 90, pinCenter: 521, stickWidth: 368 },
      { model: '470G / 670G', tonnageClass: 'heavy', operatingWeight: '47–70T', pinDiameter: 100, pinCenter: 572, stickWidth: 432 },
    ],
  },
  {
    id: 'komatsu',
    name: 'Komatsu',
    models: [
      { model: 'PC 30 / 35 / 40', tonnageClass: 'mini', operatingWeight: '3–4T', pinDiameter: 35, pinCenter: 152, stickWidth: 127 },
      { model: 'PC 50 / 55', tonnageClass: 'small', operatingWeight: '5–5.5T', pinDiameter: 45, pinCenter: 230, stickWidth: 170 },
      { model: 'PC 60 / 78', tonnageClass: 'small', operatingWeight: '6–8T', pinDiameter: 50, pinCenter: 312, stickWidth: 200 },
      { model: 'PC 100 / 120 / 128', tonnageClass: 'medium', operatingWeight: '10–13T', pinDiameter: 60, pinCenter: 375, stickWidth: 260 },
      { model: 'PC 138 / 160', tonnageClass: 'medium', operatingWeight: '14–18T', pinDiameter: 70, pinCenter: 401, stickWidth: 310 },
      { model: 'PC 200 / 210 / 220', tonnageClass: 'medium', operatingWeight: '20–22T', pinDiameter: 80, pinCenter: 458, stickWidth: 325 },
      { model: 'PC 250 / 270 / 300', tonnageClass: 'large', operatingWeight: '25–30T', pinDiameter: 90, pinCenter: 514, stickWidth: 345 },
      { model: 'PC 350 / 400', tonnageClass: 'large', operatingWeight: '35–45T', pinDiameter: 100, pinCenter: 537, stickWidth: 370 },
      { model: 'PC 600 / 750 / 800', tonnageClass: 'heavy', operatingWeight: '60–80T', pinDiameter: 130, pinCenter: 756, stickWidth: 535 },
    ],
  },
  {
    id: 'kubota',
    name: 'Kubota',
    models: [
      { model: 'KX 018 / KX 033', tonnageClass: 'mini', operatingWeight: '1.8–3.3T', pinDiameter: 30, pinCenter: 110, stickWidth: 100 },
      { model: 'KX 040 / U 45', tonnageClass: 'mini', operatingWeight: '4–4.5T', pinDiameter: 40, pinCenter: 190, stickWidth: 130 },
      { model: 'KX 057 / U 55', tonnageClass: 'small', operatingWeight: '5–5.5T', pinDiameter: 45, pinCenter: 230, stickWidth: 145 },
      { model: 'KX 080', tonnageClass: 'small', operatingWeight: '8–9T', pinDiameter: 60, pinCenter: 300, stickWidth: 200 },
      { model: 'KX 161', tonnageClass: 'small', operatingWeight: '5T', pinDiameter: 45, pinCenter: 244, stickWidth: 145 },
    ],
  },
  {
    id: 'volvo',
    name: 'Volvo',
    models: [
      { model: 'EC 27 / EC 35', tonnageClass: 'mini', operatingWeight: '2.7–3.5T', pinDiameter: 35, pinCenter: 155, stickWidth: 125 },
      { model: 'EC 55', tonnageClass: 'small', operatingWeight: '5.5T', pinDiameter: 45, pinCenter: 285, stickWidth: 165 },
      { model: 'ECR 88', tonnageClass: 'small', operatingWeight: '8.8T', pinDiameter: 60, pinCenter: 290, stickWidth: 172 },
      { model: 'EC 140', tonnageClass: 'medium', operatingWeight: '14T', pinDiameter: 65, pinCenter: 380, stickWidth: 274 },
      { model: 'EC 160', tonnageClass: 'medium', operatingWeight: '16T', pinDiameter: 70, pinCenter: 440, stickWidth: 289 },
      { model: 'EC 210 / EC 220', tonnageClass: 'medium', operatingWeight: '21–22T', pinDiameter: 80, pinCenter: 467, stickWidth: 325 },
      { model: 'EC 240 / EC 250', tonnageClass: 'large', operatingWeight: '24–28T', pinDiameter: 90, pinCenter: 506, stickWidth: 381 },
      { model: 'EC 300 / EC 350', tonnageClass: 'large', operatingWeight: '30–36T', pinDiameter: 90, pinCenter: 506, stickWidth: 381 },
      { model: 'EC 380 / EC 480', tonnageClass: 'large', operatingWeight: '38–48T', pinDiameter: 100, pinCenter: 570, stickWidth: 440 },
      { model: 'EC 700 / EC 750', tonnageClass: 'heavy', operatingWeight: '70–75T', pinDiameter: 120, pinCenter: 630, stickWidth: 510 },
    ],
  },
  {
    id: 'hitachi',
    name: 'Hitachi',
    models: [
      { model: 'ZX 30 / ZX 35', tonnageClass: 'mini', operatingWeight: '3–3.5T', pinDiameter: 35, pinCenter: 152, stickWidth: 127 },
      { model: 'ZX 50 / ZX 55', tonnageClass: 'small', operatingWeight: '5–5.5T', pinDiameter: 45, pinCenter: 229, stickWidth: 152 },
      { model: 'ZX 75 / ZX 85', tonnageClass: 'small', operatingWeight: '7.5–8.5T', pinDiameter: 50, pinCenter: 280, stickWidth: 186 },
      { model: 'ZX 130 / ZX 135', tonnageClass: 'medium', operatingWeight: '13–14T', pinDiameter: 65, pinCenter: 380, stickWidth: 250 },
      { model: 'ZX 160 / ZX 180', tonnageClass: 'medium', operatingWeight: '16–18T', pinDiameter: 70, pinCenter: 400, stickWidth: 289 },
      { model: 'ZX 200 / ZX 210', tonnageClass: 'medium', operatingWeight: '20–22T', pinDiameter: 80, pinCenter: 458, stickWidth: 325 },
      { model: 'ZX 250 / ZX 300', tonnageClass: 'large', operatingWeight: '25–30T', pinDiameter: 90, pinCenter: 506, stickWidth: 360 },
      { model: 'ZX 330 / ZX 350', tonnageClass: 'large', operatingWeight: '33–36T', pinDiameter: 90, pinCenter: 521, stickWidth: 380 },
      { model: 'ZX 470 / ZX 490', tonnageClass: 'large', operatingWeight: '47–50T', pinDiameter: 100, pinCenter: 572, stickWidth: 440 },
      { model: 'ZX 650 / ZX 870', tonnageClass: 'heavy', operatingWeight: '65–87T', pinDiameter: 120, pinCenter: 650, stickWidth: 520 },
    ],
  },
  {
    id: 'bobcat',
    name: 'Bobcat',
    models: [
      { model: 'E20 / E26', tonnageClass: 'mini', operatingWeight: '2–2.6T', pinDiameter: 30, pinCenter: 108, stickWidth: 100 },
      { model: 'E32 / E35', tonnageClass: 'mini', operatingWeight: '3.2–3.5T', pinDiameter: 38, pinCenter: 165, stickWidth: 130 },
      { model: 'E42 / E45 / E50', tonnageClass: 'mini', operatingWeight: '4.2–5T', pinDiameter: 45, pinCenter: 219, stickWidth: 152 },
      { model: 'E55 / E60', tonnageClass: 'small', operatingWeight: '5.5–6T', pinDiameter: 45, pinCenter: 229, stickWidth: 152 },
      { model: 'E85 / E88', tonnageClass: 'small', operatingWeight: '8.5–8.8T', pinDiameter: 50, pinCenter: 280, stickWidth: 186 },
      { model: 'E145 / E165', tonnageClass: 'medium', operatingWeight: '14–16T', pinDiameter: 65, pinCenter: 375, stickWidth: 245 },
    ],
  },
];

/**
 * 根据品牌 ID 和吨位获取匹配的载体型号
 */
export function getMatchingModels(brandId?: string, tonnageClass?: TonnageClass): CarrierModel[] {
  let models: CarrierModel[] = [];

  if (brandId) {
    const brand = carriers.find((c) => c.id === brandId);
    if (brand) models = brand.models;
  } else {
    models = carriers.flatMap((c) => c.models);
  }

  if (tonnageClass) {
    models = models.filter((m) => m.tonnageClass === tonnageClass);
  }

  return models;
}
