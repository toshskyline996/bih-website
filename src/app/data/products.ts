export type ProductCategory =
  | 'bucket'
  | 'rack-bucket'
  | 'breaker'
  | 'coupler'
  | 'thumb'
  | 'ripper'
  | 'auger';

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameFr: string;
  category: ProductCategory;
  categoryLabel: string;
  categoryLabelFr: string;
  tonnageRange: [number, number];
  tonnageLabel: string;
  compatibleBrands: string[];
  specs: Record<string, string>;
  specsFr: Record<string, string>;
  material: { body: string; wearParts: string };
  certificates: string[];
  description: string;
  descriptionFr: string;
  features: string[];
  featuresFr: string[];
  priceCad: number;
  weightKg: number;
  modelNumber: string;
  tag?: string;
}

export const categoryLabels: Record<ProductCategory, string> = {
  bucket: 'Excavator Buckets',
  'rack-bucket': 'Rake / Skeleton Buckets',
  breaker: 'Hydraulic Breakers',
  coupler: 'Quick Couplers',
  thumb: 'Hydraulic Thumbs',
  ripper: 'Rippers',
  auger: 'Earth Augers',
};

export const categoryLabelsFr: Record<ProductCategory, string> = {
  bucket: "Godets d'excavatrice",
  'rack-bucket': 'Godets squelettes / à barreaux',
  breaker: 'Brise-roches hydrauliques',
  coupler: 'Attaches rapides',
  thumb: 'Pouces hydrauliques',
  ripper: 'Dents de défonçage',
  auger: 'Tarières',
};

export const products: Product[] = [
  // BUCKETS
  {
    id: 'bkt-hd-01',
    slug: 'heavy-duty-excavator-bucket-12-25t',
    name: 'Heavy Duty Excavator Bucket',
    nameFr: "Godet d'excavatrice robuste",
    category: 'bucket',
    categoryLabel: 'Excavator Buckets',
    categoryLabelFr: "Godets d'excavatrice",
    tonnageRange: [12, 25],
    tonnageLabel: '12–25T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Kubota', 'Volvo', 'Hitachi', 'Bobcat'],
    specs: {
      'Operating Weight': '580–920 kg',
      'Bucket Width': '900–1200 mm',
      Capacity: '0.5–1.0 m³',
      'Cutting Edge': '20 mm Hardox 450',
      'Side Cutter': 'Hardox 450',
      'Tooth System': 'CAT J-Series or equivalent',
      'Pin Diameter': '65–80 mm',
    },
    specsFr: {
      'Poids opérationnel': '580–920 kg',
      'Largeur du godet': '900–1200 mm',
      Capacité: '0,5–1,0 m³',
      'Arête de coupe': '20 mm Hardox 450',
      'Couteaux latéraux': 'Hardox 450',
      'Système de dents': 'CAT J-Series ou équivalent',
      'Diamètre des axes': '65–80 mm',
    },
    material: { body: 'Q355 HSLA Steel', wearParts: 'Hardox 450' },
    certificates: ['CE', 'ISO 9001'],
    description:
      'Engineered for general excavation, trenching, and loading in medium-class excavators. Full-penetration welds inspected per AWS D1.1. Cutting edges and side cutters in Hardox 450 for extended service life.',
    descriptionFr:
      "Conçu pour l'excavation générale, le creusement de tranchées et le chargement avec des excavateurs de classe moyenne. Soudures à pleine pénétration inspectées selon AWS D1.1.",
    features: [
      'Q355 HSLA structural body — sub-zero impact rated',
      'Hardox 450 cutting edge and floor plate',
      'Full-penetration robotic welds — ultrasonic inspected',
      'Replaceable bolt-on side cutters',
      'Multiple width options available',
    ],
    featuresFr: [
      'Corps structural Q355 HSLA — résistant aux impacts en dessous de zéro',
      'Arête de coupe et fond en Hardox 450',
      'Soudures robotisées à pleine pénétration — inspectées par ultrasons',
      'Couteaux latéraux boulonnés remplaçables',
      'Plusieurs options de largeur disponibles',
    ],
    priceCad: 3800,
    weightKg: 750,
    modelNumber: 'BIH-EXC-HD12',
    tag: 'BESTSELLER',
  },
  {
    id: 'bkt-hd-02',
    slug: 'heavy-duty-excavator-bucket-25-50t',
    name: 'Heavy Duty Excavator Bucket — Large Class',
    nameFr: "Godet d'excavatrice robuste — Grande classe",
    category: 'bucket',
    categoryLabel: 'Excavator Buckets',
    categoryLabelFr: "Godets d'excavatrice",
    tonnageRange: [25, 50],
    tonnageLabel: '25–50T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Volvo', 'Hitachi'],
    specs: {
      'Operating Weight': '1,200–2,800 kg',
      'Bucket Width': '1200–1800 mm',
      Capacity: '1.2–3.0 m³',
      'Cutting Edge': '25 mm Hardox 450',
      'Side Cutter': 'Hardox 450',
      'Tooth System': 'CAT J-Series or equivalent',
      'Pin Diameter': '90–100 mm',
    },
    specsFr: {
      'Poids opérationnel': '1 200–2 800 kg',
      'Largeur du godet': '1200–1800 mm',
      Capacité: '1,2–3,0 m³',
      'Arête de coupe': '25 mm Hardox 450',
      'Couteaux latéraux': 'Hardox 450',
      'Système de dents': 'CAT J-Series ou équivalent',
      'Diamètre des axes': '90–100 mm',
    },
    material: { body: 'Q355 HSLA Steel', wearParts: 'Hardox 450' },
    certificates: ['CE', 'ISO 9001'],
    description:
      'Built for high-production excavation and mass earthmoving. Reinforced box-section design with internal stiffeners. Ideal for quarry, mining, and heavy civil applications.',
    descriptionFr:
      "Conçu pour l'excavation à haute production et le terrassement de masse. Structure renforcée à section en caisson avec raidisseurs internes.",
    features: [
      'Heavy-gauge Q355 box-section construction',
      '25 mm Hardox 450 cutting edge',
      'Internal wear strips on high-abrasion zones',
      'Reinforced corner guards',
      'Compatible with major OEM quick coupler systems',
    ],
    featuresFr: [
      'Construction en caisson Q355 à forte épaisseur',
      'Arête de coupe Hardox 450 de 25 mm',
      "Bandes d'usure internes sur les zones à forte abrasion",
      "Protections d'angle renforcées",
      "Compatible avec les systèmes d'attache rapide OEM majeurs",
    ],
    priceCad: 7200,
    weightKg: 2000,
    modelNumber: 'BIH-EXC-HD25',
    tag: 'HEAVY DUTY',
  },
  {
    id: 'bkt-mini-01',
    slug: 'mini-excavator-bucket-1-5t',
    name: 'Mini Excavator Bucket',
    nameFr: 'Godet pour mini-excavatrice',
    category: 'bucket',
    categoryLabel: 'Excavator Buckets',
    categoryLabelFr: "Godets d'excavatrice",
    tonnageRange: [1, 5],
    tonnageLabel: '1–5T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Kubota', 'Volvo', 'Hitachi', 'Bobcat'],
    specs: {
      'Operating Weight': '45–180 kg',
      'Bucket Width': '300–600 mm',
      Capacity: '0.03–0.15 m³',
      'Cutting Edge': '12 mm Hardox 450',
      'Tooth System': 'Mini-series teeth',
      'Pin Diameter': '30–45 mm',
    },
    specsFr: {
      'Poids opérationnel': '45–180 kg',
      'Largeur du godet': '300–600 mm',
      Capacité: '0,03–0,15 m³',
      'Arête de coupe': '12 mm Hardox 450',
      'Système de dents': 'Dents série mini',
      'Diamètre des axes': '30–45 mm',
    },
    material: { body: 'Q355 HSLA Steel', wearParts: 'Hardox 450' },
    certificates: ['CE', 'ISO 9001'],
    description:
      'Compact design for mini and micro excavators. Ideal for residential trenching, landscaping, and utility work. Available in multiple widths.',
    descriptionFr:
      "Conception compacte pour mini et micro excavateurs. Idéal pour le creusement résidentiel, l'aménagement paysager et les travaux de services publics.",
    features: [
      'Lightweight Q355 construction',
      'Hardox 450 cutting edge',
      'Fits all major mini excavator pin configurations',
      'Multiple width and tooth options',
    ],
    featuresFr: [
      'Construction légère en Q355',
      'Arête de coupe Hardox 450',
      "Compatible avec toutes les configurations d'axes de mini-excavatrice",
      'Plusieurs options de largeur et de dents',
    ],
    priceCad: 1450,
    weightKg: 120,
    modelNumber: 'BIH-EXC-MN01',
    tag: 'COMPACT',
  },
  // RAKE / SKELETON BUCKETS
  {
    id: 'rak-01',
    slug: 'skeleton-rake-bucket-12-25t',
    name: 'Skeleton Rake Bucket',
    nameFr: 'Godet squelette à barreaux',
    category: 'rack-bucket',
    categoryLabel: 'Rake / Skeleton Buckets',
    categoryLabelFr: 'Godets squelettes / à barreaux',
    tonnageRange: [12, 25],
    tonnageLabel: '12–25T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Kubota', 'Volvo', 'Hitachi', 'Bobcat'],
    specs: {
      'Operating Weight': '480–750 kg',
      'Bucket Width': '1200–1500 mm',
      'Bar Spacing': '50–75 mm (configurable)',
      'Bar Diameter': '30 mm Hardox 450 round bar',
      'Pin Diameter': '65–80 mm',
    },
    specsFr: {
      'Poids opérationnel': '480–750 kg',
      'Largeur du godet': '1200–1500 mm',
      'Espacement des barreaux': '50–75 mm (configurable)',
      'Diamètre des barreaux': '30 mm barre ronde Hardox 450',
      'Diamètre des axes': '65–80 mm',
    },
    material: { body: 'Q355 HSLA Steel', wearParts: 'Hardox 450 bars' },
    certificates: ['CE', 'ISO 9001'],
    description:
      'Open-bar design for separating soil from rocks, roots, and debris. Ideal for land clearing, demolition sorting, and site preparation.',
    descriptionFr:
      "Conception à barreaux ouverts pour séparer la terre des roches, racines et débris. Idéal pour le défrichage, le tri de démolition et la préparation de terrain.",
    features: [
      'Hardox 450 round bar tines for maximum wear resistance',
      'Configurable bar spacing for different separation needs',
      'Q355 structural frame — weld-inspected',
      'Bolt-on replaceable tines available',
    ],
    featuresFr: [
      'Dents en barre ronde Hardox 450 pour une résistance maximale',
      'Espacement des barreaux configurable',
      'Cadre structural Q355 — soudures inspectées',
      'Dents boulonnées remplaçables disponibles',
    ],
    priceCad: 3100,
    weightKg: 600,
    modelNumber: 'BIH-SKL-HD12',
    tag: 'LAND CLEARING',
  },
  // HYDRAULIC BREAKERS
  {
    id: 'brk-01',
    slug: 'hydraulic-breaker-5-12t',
    name: 'Hydraulic Breaker — Small Class',
    nameFr: 'Brise-roche hydraulique — Petite classe',
    category: 'breaker',
    categoryLabel: 'Hydraulic Breakers',
    categoryLabelFr: 'Brise-roches hydrauliques',
    tonnageRange: [5, 12],
    tonnageLabel: '5–12T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Kubota', 'Volvo', 'Hitachi', 'Bobcat'],
    specs: {
      'Operating Weight': '280–450 kg',
      'Impact Energy': '450–850 J',
      'Blow Rate': '500–900 bpm',
      'Tool Diameter': '68–85 mm',
      'Required Flow': '40–70 L/min',
      'Required Pressure': '140–170 bar',
    },
    specsFr: {
      'Poids opérationnel': '280–450 kg',
      "Énergie d'impact": '450–850 J',
      'Cadence de frappe': '500–900 cpm',
      "Diamètre de l'outil": '68–85 mm',
      'Débit requis': '40–70 L/min',
      'Pression requise': '140–170 bar',
    },
    material: { body: 'High-tensile alloy steel housing', wearParts: 'Heat-treated chisel tool' },
    certificates: ['CE', 'ISO 9001'],
    description:
      'Compact hydraulic breaker for small excavators. Membrane-type accumulator for smooth operation. Ideal for trenching, light demolition, and concrete removal.',
    descriptionFr:
      "Brise-roche hydraulique compact pour petites excavateurs. Accumulateur à membrane pour un fonctionnement fluide. Idéal pour le creusement de tranchées et la démolition légère.",
    features: [
      'Auto-greasing system for reduced maintenance',
      'Vibration-dampened housing',
      'Multiple tool point options (moil, chisel, blunt)',
      'Acoustic housing available for urban work',
    ],
    featuresFr: [
      'Système de graissage automatique',
      "Boîtier à amortissement des vibrations",
      "Plusieurs options de pointe d'outil",
      'Boîtier acoustique disponible',
    ],
    priceCad: 5200,
    weightKg: 380,
    modelNumber: 'BIH-BRK-SM05',
    tag: 'NEW 2026',
  },
  {
    id: 'brk-02',
    slug: 'hydraulic-breaker-12-30t',
    name: 'Hydraulic Breaker — Medium/Large Class',
    nameFr: 'Brise-roche hydraulique — Classe moyenne/grande',
    category: 'breaker',
    categoryLabel: 'Hydraulic Breakers',
    categoryLabelFr: 'Brise-roches hydrauliques',
    tonnageRange: [12, 30],
    tonnageLabel: '12–30T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Volvo', 'Hitachi'],
    specs: {
      'Operating Weight': '800–2,200 kg',
      'Impact Energy': '1,500–4,500 J',
      'Blow Rate': '300–600 bpm',
      'Tool Diameter': '100–155 mm',
      'Required Flow': '80–180 L/min',
      'Required Pressure': '150–180 bar',
    },
    specsFr: {
      'Poids opérationnel': '800–2 200 kg',
      "Énergie d'impact": '1 500–4 500 J',
      'Cadence de frappe': '300–600 cpm',
      "Diamètre de l'outil": '100–155 mm',
      'Débit requis': '80–180 L/min',
      'Pression requise': '150–180 bar',
    },
    material: { body: 'High-tensile alloy steel housing', wearParts: 'Heat-treated chisel tool' },
    certificates: ['CE', 'ISO 9001'],
    description:
      'High-energy hydraulic breaker for primary demolition, quarry, and mining applications. Gas/oil charged accumulator for maximum impact consistency.',
    descriptionFr:
      "Brise-roche hydraulique haute énergie pour la démolition primaire, les carrières et les applications minières.",
    features: [
      'Gas/oil accumulator for consistent impact energy',
      'Field-replaceable bushings',
      'Anti-blank-firing system',
      'Optional underwater kit',
    ],
    featuresFr: [
      "Accumulateur gaz/huile pour une énergie d'impact constante",
      'Bagues remplaçables sur le terrain',
      'Système anti-tir à vide',
      'Kit sous-marin en option',
    ],
    priceCad: 11500,
    weightKg: 1500,
    modelNumber: 'BIH-BRK-ML12',
    tag: 'HIGH POWER',
  },
  // QUICK COUPLERS
  {
    id: 'cpl-01',
    slug: 'hydraulic-quick-coupler-5-25t',
    name: 'Hydraulic Quick Coupler',
    nameFr: 'Attache rapide hydraulique',
    category: 'coupler',
    categoryLabel: 'Quick Couplers',
    categoryLabelFr: 'Attaches rapides',
    tonnageRange: [5, 25],
    tonnageLabel: '5–25T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Kubota', 'Volvo', 'Hitachi', 'Bobcat'],
    specs: {
      'Operating Weight': '180–480 kg',
      Type: 'Hydraulic pin-grabber',
      'Safety System': 'Dual-lock hydraulic + mechanical',
      'Cycle Time': '< 15 seconds',
      'Pin Diameter Range': '45–80 mm',
    },
    specsFr: {
      'Poids opérationnel': '180–480 kg',
      Type: 'Accrochage hydraulique à broches',
      'Système de sécurité': 'Double verrouillage hydraulique + mécanique',
      'Temps de cycle': '< 15 secondes',
      "Plage de diamètre d'axe": '45–80 mm',
    },
    material: { body: 'Q355 HSLA Steel', wearParts: 'Hardened locking pins' },
    certificates: ['CE', 'ISO 9001', 'EN 474'],
    description:
      'Switch attachments in seconds without leaving the cab. Dual-lock safety system with hydraulic primary and mechanical secondary lock. Meets EN 474 safety requirements.',
    descriptionFr:
      "Changez d'accessoire en quelques secondes sans quitter la cabine. Système de sécurité à double verrouillage. Conforme aux exigences de sécurité EN 474.",
    features: [
      'Dual-lock safety: hydraulic + mechanical backup',
      'Front-lock pin-grabber design',
      'Visual safety indicator from cab',
      'Fits standard pin configurations across brands',
      'Fall-arrest safety certification',
    ],
    featuresFr: [
      'Sécurité à double verrouillage : hydraulique + mécanique',
      'Conception à accrochage frontal par broches',
      'Indicateur visuel de sécurité depuis la cabine',
      'Compatible avec les configurations de toutes les marques',
      'Certification de sécurité anti-chute',
    ],
    priceCad: 3200,
    weightKg: 330,
    modelNumber: 'BIH-CPL-HY05',
    tag: 'EN 474',
  },
  // HYDRAULIC THUMBS
  {
    id: 'thm-01',
    slug: 'hydraulic-thumb-5-25t',
    name: 'Hydraulic Thumb',
    nameFr: 'Pouce hydraulique',
    category: 'thumb',
    categoryLabel: 'Hydraulic Thumbs',
    categoryLabelFr: 'Pouces hydrauliques',
    tonnageRange: [5, 25],
    tonnageLabel: '5–25T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Kubota', 'Volvo', 'Hitachi', 'Bobcat'],
    specs: {
      'Operating Weight': '120–380 kg',
      'Thumb Width': '600–1000 mm',
      'Cylinder Bore': '70–100 mm',
      'Arc of Rotation': '180°',
      'Tine Material': 'Hardox 450',
    },
    specsFr: {
      'Poids opérationnel': '120–380 kg',
      'Largeur du pouce': '600–1000 mm',
      'Alésage du vérin': '70–100 mm',
      'Arc de rotation': '180°',
      'Matériau des dents': 'Hardox 450',
    },
    material: { body: 'Q355 HSLA Steel', wearParts: 'Hardox 450 tines' },
    certificates: ['CE', 'ISO 9001'],
    description:
      'Pin-on hydraulic thumb for material handling, demolition sorting, and brush clearing. Full 180° rotation for maximum versatility.',
    descriptionFr:
      "Pouce hydraulique à montage par axe pour la manutention de matériaux, le tri de démolition et le défrichage. Rotation complète de 180°.",
    features: [
      'Hardox 450 serrated tines for positive grip',
      '180° arc for maximum reach',
      'Heavy-duty hydraulic cylinder with port relief',
      'Weld-on or pin-on mounting options',
    ],
    featuresFr: [
      'Dents dentelées Hardox 450 pour une prise positive',
      'Arc de 180° pour une portée maximale',
      'Vérin hydraulique robuste avec soupape de décharge',
      'Options de montage soudé ou par axe',
    ],
    priceCad: 2700,
    weightKg: 250,
    modelNumber: 'BIH-THM-HY05',
    tag: 'VERSATILE',
  },
  // RIPPERS
  {
    id: 'rip-01',
    slug: 'single-shank-ripper-12-30t',
    name: 'Single Shank Ripper',
    nameFr: 'Dent de défonçage à tige unique',
    category: 'ripper',
    categoryLabel: 'Rippers',
    categoryLabelFr: 'Dents de défonçage',
    tonnageRange: [12, 30],
    tonnageLabel: '12–30T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Volvo', 'Hitachi'],
    specs: {
      'Operating Weight': '350–900 kg',
      'Shank Length': '600–900 mm',
      'Tooth Type': 'Replaceable ripper tooth',
      'Tooth Material': 'Hardox 450',
      'Pin Diameter': '65–90 mm',
    },
    specsFr: {
      'Poids opérationnel': '350–900 kg',
      'Longueur de la tige': '600–900 mm',
      'Type de dent': 'Dent de ripper remplaçable',
      'Matériau de la dent': 'Hardox 450',
      'Diamètre des axes': '65–90 mm',
    },
    material: { body: 'Q355 HSLA Steel', wearParts: 'Hardox 450 shank tip' },
    certificates: ['CE', 'ISO 9001'],
    description:
      'Single-shank ripper for breaking up frozen ground, hard clay, soft rock, and asphalt. Ideal for Canadian winter ground conditions.',
    descriptionFr:
      "Dent de défonçage à tige unique pour briser le sol gelé, l'argile dure, la roche tendre et l'asphalte. Idéal pour les hivers canadiens.",
    features: [
      'Replaceable Hardox 450 ripper tooth',
      'Reinforced shank pocket with wear plate',
      'Designed for frost-line breaking in Canadian winters',
      'Compatible with standard pin-on and quick coupler mounts',
    ],
    featuresFr: [
      'Dent de ripper Hardox 450 remplaçable',
      'Logement de tige renforcé avec plaque',
      'Conçu pour briser la ligne de gel',
      'Compatible montages standard et attache rapide',
    ],
    priceCad: 2900,
    weightKg: 625,
    modelNumber: 'BIH-RIP-SS12',
    tag: 'CANADIAN WINTER',
  },
  // EARTH AUGERS
  {
    id: 'aug-01',
    slug: 'earth-auger-drive-unit-5-25t',
    name: 'Hydraulic Earth Auger Drive Unit',
    nameFr: "Unité d'entraînement de tarière hydraulique",
    category: 'auger',
    categoryLabel: 'Earth Augers',
    categoryLabelFr: 'Tarières',
    tonnageRange: [5, 25],
    tonnageLabel: '5–25T',
    compatibleBrands: ['CAT', 'John Deere', 'Komatsu', 'Kubota', 'Volvo', 'Hitachi', 'Bobcat'],
    specs: {
      'Drive Unit Weight': '250–550 kg',
      'Output Torque': '3,000–12,000 Nm',
      Speed: '20–60 rpm',
      'Required Flow': '50–120 L/min',
      'Auger Bit Diameter': '150–900 mm',
      'Max Drilling Depth': '3–6 m (with extensions)',
      'Drive Connection': '2" hex or 65mm round',
    },
    specsFr: {
      "Poids de l'unité": '250–550 kg',
      'Couple de sortie': '3 000–12 000 Nm',
      Vitesse: '20–60 tr/min',
      'Débit requis': '50–120 L/min',
      'Diamètre de la mèche': '150–900 mm',
      'Profondeur max de forage': '3–6 m (avec rallonges)',
      "Connexion d'entraînement": 'Hexagone 2" ou rond 65 mm',
    },
    material: { body: 'Ductile iron gearbox housing', wearParts: 'Hardox 450 auger flights & teeth' },
    certificates: ['CE', 'ISO 9001'],
    description:
      'Planetary gear-driven auger unit for fence posts, sign poles, tree planting, and foundation piles. Multiple auger bit sizes available from 150 mm to 900 mm.',
    descriptionFr:
      "Unité de tarière à engrenages planétaires pour poteaux de clôture, plantation d'arbres et pieux de fondation. Plusieurs tailles de mèche disponibles.",
    features: [
      'Planetary gearbox for high torque at low speed',
      'Hardox 450 auger flights and replaceable teeth',
      'Multiple bit sizes: 150–900 mm',
      'Extension shafts available for deep drilling',
      'Reverse rotation for extracting from sticky soil',
    ],
    featuresFr: [
      'Boîte de vitesses planétaire pour un couple élevé',
      'Spires de tarière Hardox 450 et dents remplaçables',
      'Plusieurs tailles de mèche : 150–900 mm',
      'Rallonges disponibles pour le forage profond',
      'Rotation inversée pour extraction',
    ],
    priceCad: 4200,
    weightKg: 400,
    modelNumber: 'BIH-AUG-DR05',
    tag: 'CUSTOM',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function filterProducts(opts: {
  category?: ProductCategory;
  brand?: string;
}): Product[] {
  let filtered = [...products];
  if (opts.category) filtered = filtered.filter((p) => p.category === opts.category);
  if (opts.brand) filtered = filtered.filter((p) => p.compatibleBrands.includes(opts.brand!));
  return filtered;
}
