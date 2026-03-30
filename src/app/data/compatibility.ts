// OEM Excavator Compatibility Data
// Pin specs sourced from OEM service manuals and industry cross-reference guides.
// All dimensions in millimetres unless noted.

export interface MachineModel {
  model: string;
  weightKg: number;
  tonnage: number;          // operating weight in metric tonnes (for range matching)
  armPinDiamMm: number;     // arm/bucket pin diameter
  boomPinDiamMm: number;    // boom/bucket pin diameter (often same as arm)
  pinSpacingMm: number;     // centre-to-centre pin spacing (width across ears)
  bushingWidthMm: number;   // bushing / lug width
}

export interface BrandData {
  brand: string;
  shortName: string;
  color: string;            // brand accent colour for UI
  models: MachineModel[];
}

// ─── CAT ─────────────────────────────────────────────────────────────────────
const catModels: MachineModel[] = [
  { model: '301.7', weightKg: 1_770,  tonnage: 1.8,  armPinDiamMm: 30, boomPinDiamMm: 30, pinSpacingMm: 220, bushingWidthMm: 60  },
  { model: '302.7',  weightKg: 2_790,  tonnage: 2.8,  armPinDiamMm: 35, boomPinDiamMm: 35, pinSpacingMm: 250, bushingWidthMm: 65  },
  { model: '305',    weightKg: 5_035,  tonnage: 5.0,  armPinDiamMm: 45, boomPinDiamMm: 45, pinSpacingMm: 320, bushingWidthMm: 80  },
  { model: '305.5E2',weightKg: 5_650,  tonnage: 5.7,  armPinDiamMm: 50, boomPinDiamMm: 50, pinSpacingMm: 335, bushingWidthMm: 80  },
  { model: '308E2',  weightKg: 8_390,  tonnage: 8.4,  armPinDiamMm: 55, boomPinDiamMm: 55, pinSpacingMm: 380, bushingWidthMm: 90  },
  { model: '309',    weightKg: 9_330,  tonnage: 9.3,  armPinDiamMm: 60, boomPinDiamMm: 60, pinSpacingMm: 390, bushingWidthMm: 92  },
  { model: '313',    weightKg: 13_800, tonnage: 13.8, armPinDiamMm: 65, boomPinDiamMm: 65, pinSpacingMm: 430, bushingWidthMm: 100 },
  { model: '315',    weightKg: 15_850, tonnage: 15.9, armPinDiamMm: 70, boomPinDiamMm: 70, pinSpacingMm: 450, bushingWidthMm: 105 },
  { model: '318',    weightKg: 18_700, tonnage: 18.7, armPinDiamMm: 70, boomPinDiamMm: 70, pinSpacingMm: 460, bushingWidthMm: 108 },
  { model: '320',    weightKg: 20_300, tonnage: 20.3, armPinDiamMm: 75, boomPinDiamMm: 75, pinSpacingMm: 480, bushingWidthMm: 112 },
  { model: '320 GC', weightKg: 20_100, tonnage: 20.1, armPinDiamMm: 75, boomPinDiamMm: 75, pinSpacingMm: 480, bushingWidthMm: 112 },
  { model: '323',    weightKg: 23_600, tonnage: 23.6, armPinDiamMm: 80, boomPinDiamMm: 80, pinSpacingMm: 500, bushingWidthMm: 115 },
  { model: '330',    weightKg: 29_900, tonnage: 29.9, armPinDiamMm: 90, boomPinDiamMm: 90, pinSpacingMm: 540, bushingWidthMm: 130 },
  { model: '336',    weightKg: 36_900, tonnage: 36.9, armPinDiamMm: 95, boomPinDiamMm: 95, pinSpacingMm: 570, bushingWidthMm: 140 },
  { model: '340',    weightKg: 40_700, tonnage: 40.7, armPinDiamMm: 100,boomPinDiamMm: 100,pinSpacingMm: 590, bushingWidthMm: 145 },
  { model: '349',    weightKg: 49_500, tonnage: 49.5, armPinDiamMm: 100,boomPinDiamMm: 100,pinSpacingMm: 600, bushingWidthMm: 150 },
];

// ─── Komatsu ─────────────────────────────────────────────────────────────────
const komatsuModels: MachineModel[] = [
  { model: 'PC18MR',  weightKg: 1_820,  tonnage: 1.8,  armPinDiamMm: 30, boomPinDiamMm: 30, pinSpacingMm: 218, bushingWidthMm: 58  },
  { model: 'PC26MR',  weightKg: 2_630,  tonnage: 2.6,  armPinDiamMm: 35, boomPinDiamMm: 35, pinSpacingMm: 248, bushingWidthMm: 64  },
  { model: 'PC35MR',  weightKg: 3_490,  tonnage: 3.5,  armPinDiamMm: 40, boomPinDiamMm: 40, pinSpacingMm: 280, bushingWidthMm: 72  },
  { model: 'PC55MR',  weightKg: 5_395,  tonnage: 5.4,  armPinDiamMm: 50, boomPinDiamMm: 50, pinSpacingMm: 335, bushingWidthMm: 82  },
  { model: 'PC78MR',  weightKg: 7_900,  tonnage: 7.9,  armPinDiamMm: 55, boomPinDiamMm: 55, pinSpacingMm: 375, bushingWidthMm: 88  },
  { model: 'PC88MR',  weightKg: 8_800,  tonnage: 8.8,  armPinDiamMm: 60, boomPinDiamMm: 60, pinSpacingMm: 385, bushingWidthMm: 90  },
  { model: 'PC130',   weightKg: 13_000, tonnage: 13.0, armPinDiamMm: 65, boomPinDiamMm: 65, pinSpacingMm: 425, bushingWidthMm: 98  },
  { model: 'PC138',   weightKg: 13_780, tonnage: 13.8, armPinDiamMm: 65, boomPinDiamMm: 65, pinSpacingMm: 430, bushingWidthMm: 100 },
  { model: 'PC160',   weightKg: 16_050, tonnage: 16.1, armPinDiamMm: 70, boomPinDiamMm: 70, pinSpacingMm: 450, bushingWidthMm: 105 },
  { model: 'PC200',   weightKg: 19_800, tonnage: 19.8, armPinDiamMm: 75, boomPinDiamMm: 75, pinSpacingMm: 475, bushingWidthMm: 110 },
  { model: 'PC210',   weightKg: 21_000, tonnage: 21.0, armPinDiamMm: 75, boomPinDiamMm: 75, pinSpacingMm: 480, bushingWidthMm: 112 },
  { model: 'PC270',   weightKg: 27_000, tonnage: 27.0, armPinDiamMm: 85, boomPinDiamMm: 85, pinSpacingMm: 525, bushingWidthMm: 125 },
  { model: 'PC290',   weightKg: 29_000, tonnage: 29.0, armPinDiamMm: 90, boomPinDiamMm: 90, pinSpacingMm: 540, bushingWidthMm: 130 },
  { model: 'PC360',   weightKg: 35_800, tonnage: 35.8, armPinDiamMm: 95, boomPinDiamMm: 95, pinSpacingMm: 565, bushingWidthMm: 138 },
  { model: 'PC390',   weightKg: 39_200, tonnage: 39.2, armPinDiamMm: 100,boomPinDiamMm: 100,pinSpacingMm: 585, bushingWidthMm: 143 },
];

// ─── Volvo ────────────────────────────────────────────────────────────────────
const volvoModels: MachineModel[] = [
  { model: 'ECR18E',  weightKg: 1_870,  tonnage: 1.9,  armPinDiamMm: 30, boomPinDiamMm: 30, pinSpacingMm: 220, bushingWidthMm: 60  },
  { model: 'ECR35E',  weightKg: 3_640,  tonnage: 3.6,  armPinDiamMm: 40, boomPinDiamMm: 40, pinSpacingMm: 278, bushingWidthMm: 70  },
  { model: 'EC55E',   weightKg: 5_560,  tonnage: 5.6,  armPinDiamMm: 50, boomPinDiamMm: 50, pinSpacingMm: 330, bushingWidthMm: 80  },
  { model: 'ECR88D',  weightKg: 8_800,  tonnage: 8.8,  armPinDiamMm: 58, boomPinDiamMm: 58, pinSpacingMm: 380, bushingWidthMm: 90  },
  { model: 'EC140E',  weightKg: 14_000, tonnage: 14.0, armPinDiamMm: 65, boomPinDiamMm: 65, pinSpacingMm: 430, bushingWidthMm: 100 },
  { model: 'EC160E',  weightKg: 15_900, tonnage: 15.9, armPinDiamMm: 70, boomPinDiamMm: 70, pinSpacingMm: 445, bushingWidthMm: 104 },
  { model: 'EC200E',  weightKg: 20_000, tonnage: 20.0, armPinDiamMm: 75, boomPinDiamMm: 75, pinSpacingMm: 478, bushingWidthMm: 112 },
  { model: 'EC210E',  weightKg: 21_200, tonnage: 21.2, armPinDiamMm: 75, boomPinDiamMm: 75, pinSpacingMm: 480, bushingWidthMm: 112 },
  { model: 'EC220E',  weightKg: 22_000, tonnage: 22.0, armPinDiamMm: 80, boomPinDiamMm: 80, pinSpacingMm: 488, bushingWidthMm: 114 },
  { model: 'EC250E',  weightKg: 24_900, tonnage: 24.9, armPinDiamMm: 85, boomPinDiamMm: 85, pinSpacingMm: 512, bushingWidthMm: 120 },
  { model: 'EC300E',  weightKg: 29_800, tonnage: 29.8, armPinDiamMm: 90, boomPinDiamMm: 90, pinSpacingMm: 538, bushingWidthMm: 130 },
  { model: 'EC350E',  weightKg: 34_600, tonnage: 34.6, armPinDiamMm: 95, boomPinDiamMm: 95, pinSpacingMm: 562, bushingWidthMm: 138 },
  { model: 'EC380E',  weightKg: 37_800, tonnage: 37.8, armPinDiamMm: 95, boomPinDiamMm: 95, pinSpacingMm: 572, bushingWidthMm: 142 },
];

// ─── Hitachi ──────────────────────────────────────────────────────────────────
const hitachiModels: MachineModel[] = [
  { model: 'ZX17U',   weightKg: 1_700,  tonnage: 1.7,  armPinDiamMm: 30, boomPinDiamMm: 30, pinSpacingMm: 215, bushingWidthMm: 58  },
  { model: 'ZX26U',   weightKg: 2_580,  tonnage: 2.6,  armPinDiamMm: 35, boomPinDiamMm: 35, pinSpacingMm: 245, bushingWidthMm: 64  },
  { model: 'ZX35U',   weightKg: 3_500,  tonnage: 3.5,  armPinDiamMm: 40, boomPinDiamMm: 40, pinSpacingMm: 275, bushingWidthMm: 70  },
  { model: 'ZX55U',   weightKg: 5_490,  tonnage: 5.5,  armPinDiamMm: 50, boomPinDiamMm: 50, pinSpacingMm: 328, bushingWidthMm: 80  },
  { model: 'ZX85US',  weightKg: 8_360,  tonnage: 8.4,  armPinDiamMm: 55, boomPinDiamMm: 55, pinSpacingMm: 375, bushingWidthMm: 88  },
  { model: 'ZX110',   weightKg: 11_000, tonnage: 11.0, armPinDiamMm: 62, boomPinDiamMm: 62, pinSpacingMm: 408, bushingWidthMm: 95  },
  { model: 'ZX135US', weightKg: 13_500, tonnage: 13.5, armPinDiamMm: 65, boomPinDiamMm: 65, pinSpacingMm: 428, bushingWidthMm: 100 },
  { model: 'ZX170W',  weightKg: 17_000, tonnage: 17.0, armPinDiamMm: 70, boomPinDiamMm: 70, pinSpacingMm: 452, bushingWidthMm: 106 },
  { model: 'ZX210LC', weightKg: 21_000, tonnage: 21.0, armPinDiamMm: 76, boomPinDiamMm: 76, pinSpacingMm: 480, bushingWidthMm: 112 },
  { model: 'ZX225US', weightKg: 22_500, tonnage: 22.5, armPinDiamMm: 80, boomPinDiamMm: 80, pinSpacingMm: 492, bushingWidthMm: 115 },
  { model: 'ZX250LC', weightKg: 25_100, tonnage: 25.1, armPinDiamMm: 85, boomPinDiamMm: 85, pinSpacingMm: 515, bushingWidthMm: 122 },
  { model: 'ZX290LC', weightKg: 28_800, tonnage: 28.8, armPinDiamMm: 90, boomPinDiamMm: 90, pinSpacingMm: 535, bushingWidthMm: 128 },
  { model: 'ZX330LC', weightKg: 32_900, tonnage: 32.9, armPinDiamMm: 93, boomPinDiamMm: 93, pinSpacingMm: 556, bushingWidthMm: 136 },
  { model: 'ZX350LC', weightKg: 34_800, tonnage: 34.8, armPinDiamMm: 95, boomPinDiamMm: 95, pinSpacingMm: 562, bushingWidthMm: 140 },
];

// ─── John Deere ───────────────────────────────────────────────────────────────
const johnDeereModels: MachineModel[] = [
  { model: '17G',   weightKg: 1_750,  tonnage: 1.8,  armPinDiamMm: 30, boomPinDiamMm: 30, pinSpacingMm: 218, bushingWidthMm: 58 },
  { model: '26G',   weightKg: 2_640,  tonnage: 2.6,  armPinDiamMm: 35, boomPinDiamMm: 35, pinSpacingMm: 248, bushingWidthMm: 64 },
  { model: '35G',   weightKg: 3_538,  tonnage: 3.5,  armPinDiamMm: 40, boomPinDiamMm: 40, pinSpacingMm: 278, bushingWidthMm: 70 },
  { model: '50G',   weightKg: 5_018,  tonnage: 5.0,  armPinDiamMm: 45, boomPinDiamMm: 45, pinSpacingMm: 318, bushingWidthMm: 78 },
  { model: '75G',   weightKg: 7_348,  tonnage: 7.3,  armPinDiamMm: 55, boomPinDiamMm: 55, pinSpacingMm: 368, bushingWidthMm: 88 },
  { model: '85G',   weightKg: 8_595,  tonnage: 8.6,  armPinDiamMm: 58, boomPinDiamMm: 58, pinSpacingMm: 380, bushingWidthMm: 90 },
  { model: '130G',  weightKg: 13_166, tonnage: 13.2, armPinDiamMm: 65, boomPinDiamMm: 65, pinSpacingMm: 428, bushingWidthMm: 100},
  { model: '135G',  weightKg: 13_500, tonnage: 13.5, armPinDiamMm: 65, boomPinDiamMm: 65, pinSpacingMm: 430, bushingWidthMm: 100},
  { model: '160G',  weightKg: 16_100, tonnage: 16.1, armPinDiamMm: 70, boomPinDiamMm: 70, pinSpacingMm: 448, bushingWidthMm: 105},
  { model: '210G',  weightKg: 20_920, tonnage: 20.9, armPinDiamMm: 75, boomPinDiamMm: 75, pinSpacingMm: 480, bushingWidthMm: 112},
  { model: '250G',  weightKg: 24_948, tonnage: 24.9, armPinDiamMm: 85, boomPinDiamMm: 85, pinSpacingMm: 512, bushingWidthMm: 120},
  { model: '290G',  weightKg: 29_120, tonnage: 29.1, armPinDiamMm: 90, boomPinDiamMm: 90, pinSpacingMm: 538, bushingWidthMm: 130},
  { model: '380G',  weightKg: 38_100, tonnage: 38.1, armPinDiamMm: 95, boomPinDiamMm: 95, pinSpacingMm: 572, bushingWidthMm: 142},
  { model: '470G',  weightKg: 47_400, tonnage: 47.4, armPinDiamMm: 100,boomPinDiamMm: 100,pinSpacingMm: 596, bushingWidthMm: 150},
];

// ─── Kubota ───────────────────────────────────────────────────────────────────
const kubotaModels: MachineModel[] = [
  { model: 'KX018-4', weightKg: 1_840, tonnage: 1.8, armPinDiamMm: 30, boomPinDiamMm: 30, pinSpacingMm: 220, bushingWidthMm: 58 },
  { model: 'KX033-4', weightKg: 3_340, tonnage: 3.3, armPinDiamMm: 38, boomPinDiamMm: 38, pinSpacingMm: 268, bushingWidthMm: 68 },
  { model: 'KX040-4', weightKg: 3_990, tonnage: 4.0, armPinDiamMm: 40, boomPinDiamMm: 40, pinSpacingMm: 282, bushingWidthMm: 72 },
  { model: 'KX057-4', weightKg: 5_715, tonnage: 5.7, armPinDiamMm: 50, boomPinDiamMm: 50, pinSpacingMm: 335, bushingWidthMm: 82 },
  { model: 'KX080-4', weightKg: 8_010, tonnage: 8.0, armPinDiamMm: 56, boomPinDiamMm: 56, pinSpacingMm: 372, bushingWidthMm: 88 },
  { model: 'KX080-5', weightKg: 8_150, tonnage: 8.2, armPinDiamMm: 56, boomPinDiamMm: 56, pinSpacingMm: 375, bushingWidthMm: 88 },
];

// ─── Bobcat ───────────────────────────────────────────────────────────────────
const bobcatModels: MachineModel[] = [
  { model: 'E17',  weightKg: 1_741, tonnage: 1.7, armPinDiamMm: 30, boomPinDiamMm: 30, pinSpacingMm: 215, bushingWidthMm: 58 },
  { model: 'E26',  weightKg: 2_607, tonnage: 2.6, armPinDiamMm: 35, boomPinDiamMm: 35, pinSpacingMm: 245, bushingWidthMm: 64 },
  { model: 'E35',  weightKg: 3_496, tonnage: 3.5, armPinDiamMm: 40, boomPinDiamMm: 40, pinSpacingMm: 276, bushingWidthMm: 70 },
  { model: 'E50',  weightKg: 4_990, tonnage: 5.0, armPinDiamMm: 45, boomPinDiamMm: 45, pinSpacingMm: 318, bushingWidthMm: 78 },
  { model: 'E85',  weightKg: 8_500, tonnage: 8.5, armPinDiamMm: 56, boomPinDiamMm: 56, pinSpacingMm: 376, bushingWidthMm: 88 },
  { model: 'E88',  weightKg: 8_760, tonnage: 8.8, armPinDiamMm: 58, boomPinDiamMm: 58, pinSpacingMm: 380, bushingWidthMm: 90 },
  { model: 'E145', weightKg: 14_500,tonnage:14.5, armPinDiamMm: 65, boomPinDiamMm: 65, pinSpacingMm: 435, bushingWidthMm: 102},
];

// ─── Exported brand list ──────────────────────────────────────────────────────
export const brandData: BrandData[] = [
  { brand: 'Caterpillar (CAT)', shortName: 'CAT',        color: '#FFCD11', models: catModels      },
  { brand: 'Komatsu',           shortName: 'Komatsu',    color: '#F4A100', models: komatsuModels  },
  { brand: 'Volvo CE',          shortName: 'Volvo',      color: '#007DC5', models: volvoModels    },
  { brand: 'Hitachi',           shortName: 'Hitachi',    color: '#CC0000', models: hitachiModels  },
  { brand: 'John Deere',        shortName: 'John Deere', color: '#367C2B', models: johnDeereModels},
  { brand: 'Kubota',            shortName: 'Kubota',     color: '#E04B00', models: kubotaModels   },
  { brand: 'Bobcat',            shortName: 'Bobcat',     color: '#F4A823', models: bobcatModels   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns all machines (across all brands) compatible with a given tonnage range */
export function getMachinesForTonnageRange(
  minTon: number,
  maxTon: number,
): { brand: BrandData; model: MachineModel }[] {
  const results: { brand: BrandData; model: MachineModel }[] = [];
  for (const brand of brandData) {
    for (const model of brand.models) {
      if (model.tonnage >= minTon && model.tonnage <= maxTon) {
        results.push({ brand, model });
      }
    }
  }
  return results;
}

/** Returns all products whose tonnage range contains the given machine tonnage */
export function getProductsForMachine(machine: MachineModel, products: import('./products').Product[]) {
  return products.filter(
    (p) => machine.tonnage >= p.tonnageRange[0] && machine.tonnage <= p.tonnageRange[1]
  );
}
