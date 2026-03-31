import { useParams, Link } from 'react-router';
import { ArrowRight, MapPin, Wrench, Shield } from 'lucide-react';
import { brandData } from '../data/compatibility';
import { products } from '../data/products';
import { usePageMeta } from '../hooks/usePageMeta';

const IL = { fontFamily: "'Inter', sans-serif" };

const SLUG_MAP: Record<string, string> = {
  'cat':        'CAT',
  'komatsu':    'Komatsu',
  'volvo':      'Volvo',
  'hitachi':    'Hitachi',
  'john-deere': 'John Deere',
  'kubota':     'Kubota',
  'bobcat':     'Bobcat',
};

const BRAND_SEO: Record<string, { h1: string; intro: string }> = {
  CAT: {
    h1: 'CAT Excavator\nAttachments\nCanada',
    intro: 'Factory-direct Q355 HSLA steel buckets, breakers, thumbs, and couplers for the full CAT excavator range. Engineered to OEM pin specs — 301.7 to 349 — priced for Canadian contractors.',
  },
  Komatsu: {
    h1: 'Komatsu Excavator\nAttachments\nCanada',
    intro: 'Q355 steel attachments machined to Komatsu OEM pin specifications. PC18MR to PC390 — every model in stock or made-to-order with 6–10 week delivery FOB Qingdao.',
  },
  Volvo: {
    h1: 'Volvo CE Excavator\nAttachments\nCanada',
    intro: 'Heavy-duty buckets, breakers, and quick couplers for Volvo ECR and EC excavators. Q355 structural steel, Hardox 450 wear zones, CE certified — ECR18E to EC380E.',
  },
  Hitachi: {
    h1: 'Hitachi Excavator\nAttachments\nCanada',
    intro: 'Precision-fit Q355 steel attachments for Hitachi ZX series excavators. From ZX17U to ZX350LC — pin dimensions verified against OEM service manuals.',
  },
  'John Deere': {
    h1: 'John Deere Excavator\nAttachments\nCanada',
    intro: 'Factory-direct buckets, breakers, and thumbs for John Deere G-series excavators. Q355 steel, ISO 9001 certified, shipped FOB Qingdao or direct to Canadian job site.',
  },
  Kubota: {
    h1: 'Kubota Excavator\nAttachments\nCanada',
    intro: 'Compact attachment solutions for Kubota KX series excavators. Q355 HSLA steel — stronger and lighter than standard S355 alternatives. KX018-4 to KX080-5.',
  },
  Bobcat: {
    h1: 'Bobcat Excavator\nAttachments\nCanada',
    intro: 'Heavy-duty attachments for Bobcat compact excavators (E17 to E145). Q355 structural steel, Hardox 450 cutting edges, compatible with Bobcat S-lock couplers.',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  bucket:       'Excavator Buckets',
  'rack-bucket':'Rake / Skeleton Buckets',
  breaker:      'Hydraulic Breakers',
  coupler:      'Quick Couplers',
  thumb:        'Hydraulic Thumbs',
  ripper:       'Rippers',
  auger:        'Earth Augers',
};

const PRICE_FMT = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

export function BrandLandingPage() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const shortName = SLUG_MAP[brandSlug ?? ''];
  const brand = brandData.find((b) => b.shortName === shortName);

  const compatibleProducts = brand
    ? products.filter((p) => p.compatibleBrands.includes(shortName))
    : [];

  const minTon = brand ? Math.min(...brand.models.map((m) => m.tonnage)) : 0;
  const maxTon = brand ? Math.max(...brand.models.map((m) => m.tonnage)) : 0;
  const seo = brand ? BRAND_SEO[shortName] : null;

  usePageMeta({
    title: brand
      ? `${brand.brand} Excavator Attachments Canada — Q355 Steel`
      : 'Excavator Attachments Canada',
    description: brand
      ? `Factory-direct Q355 steel buckets, breakers & thumbs for ${brand.brand} excavators (${minTon}–${maxTon}t). Canadian supplier. Get a quote in 48h.`
      : '',
    url: brand ? `https://borealironheavy.ca/excavator-attachments/${brandSlug}` : undefined,
  });

  if (!brand || !seo) {
    return (
      <div style={{ ...IL, padding: '120px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase' }}>
          Brand Not Found
        </h1>
        <Link to="/products" style={{ fontSize: '12px', color: '#555', textDecoration: 'none', marginTop: '16px', display: 'inline-block' }}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div style={IL}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '14px 0', borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center gap-2" style={{ fontSize: '11px', color: '#888' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 300 }}>Home</Link>
          <span style={{ color: '#ccc', margin: '0 4px' }}>›</span>
          <Link to="/products" style={{ color: '#888', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 300 }}>Products</Link>
          <span style={{ color: '#ccc', margin: '0 4px' }}>›</span>
          <span style={{ color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 400 }}>{brand.brand}</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '80px 0 70px' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: brand.color, flexShrink: 0 }} />
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 300 }}>
              {brand.brand} · {brand.models.length} Models · {minTon}–{maxTon}t
            </p>
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 5.5vw, 72px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.02, maxWidth: '760px', whiteSpace: 'pre-line' }}>
            {seo.h1}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, marginTop: '24px', maxWidth: '560px', lineHeight: 1.8 }}>
            {seo.intro}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to="/contact" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', padding: '14px 32px', backgroundColor: '#ffc500', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Get a Quote <ArrowRight size={14} />
            </Link>
            <Link to="/compatibility" style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '0.15em', padding: '14px 32px', border: '1.5px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', textDecoration: 'none' }}>
              OEM Compatibility Tool
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: brand.color, padding: '28px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: `${brand.models.length}`,          label: 'Compatible Models' },
              { val: `${minTon}–${maxTon}t`,            label: 'Tonnage Range' },
              { val: `${compatibleProducts.length}`,    label: 'Attachment Types' },
              { val: 'ISO 9001',                        label: 'Quality Standard' },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: '9px', fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(26,26,26,0.55)', textTransform: 'uppercase', marginTop: '5px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compatible Products */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '12px' }}>
            01 — Compatible Attachments
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: '8px' }}>
            {compatibleProducts.length} Products for {brand.shortName}
          </h2>
          <p style={{ fontSize: '13px', color: '#888', fontWeight: 300, lineHeight: 1.7, maxWidth: '480px', marginBottom: '48px' }}>
            All attachment specs are matched to {brand.brand} OEM pin dimensions. Custom pin-to-pin dimensions available on confirmed orders.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {compatibleProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                style={{ textDecoration: 'none', display: 'block', border: '1px solid #ebebeb', padding: '24px', backgroundColor: '#fff' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ffc500'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ebebeb'; }}
              >
                <p style={{ fontSize: '9px', letterSpacing: '0.25em', color: '#aaa', textTransform: 'uppercase', fontWeight: 300, marginBottom: '8px' }}>
                  {CATEGORY_LABELS[product.category]}
                </p>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.3, marginBottom: '12px' }}>
                  {product.name}
                </h3>
                <p style={{ fontSize: '11px', color: '#888', fontWeight: 300, marginBottom: '16px' }}>
                  {product.tonnageRange[0]}–{product.tonnageRange[1]}T
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '16px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                    {PRICE_FMT.format(product.priceCad)}
                  </p>
                  <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#555', textTransform: 'uppercase', fontWeight: 400 }}>
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Model Spec Table */}
      <section style={{ backgroundColor: '#f5f5f5', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '12px' }}>
            02 — OEM Pin Specifications
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: '8px' }}>
            {brand.brand} Model Reference
          </h2>
          <p style={{ fontSize: '13px', color: '#888', fontWeight: 300, lineHeight: 1.7, maxWidth: '520px', marginBottom: '40px' }}>
            Attachments are manufactured to these exact pin dimensions. Custom bores machined at no extra charge for confirmed orders.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1a1a' }}>
                  {['Model', 'Weight (kg)', 'Tonnage', 'Pin Ø (mm)', 'Pin Spacing (mm)', 'Bushing Width (mm)'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#fff', fontWeight: 600, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brand.models.map((model, i) => (
                  <tr key={model.model} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #ebebeb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1a1a1a' }}>{brand.shortName} {model.model}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{model.weightKg.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{model.tonnage}t</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{model.armPinDiamMm}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{model.pinSpacingMm}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{model.bushingWidthMm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '11px', color: '#aaa', fontWeight: 300, marginTop: '16px' }}>
            Pin dimensions sourced from OEM service manuals and industry cross-reference guides. Verify with your machine documentation before ordering.
          </p>
        </div>
      </section>

      {/* Why BIH */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '12px' }}>
            03 — Why BIH
          </p>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: '48px' }}>
            Factory Direct.<br />Canadian Certified.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Shield,
                title: 'Q355 HSLA Steel',
                desc: `Yields 30% higher strength vs. S235/A36. Sub-zero impact tested at −40°C for Canadian climate certification. All ${brand.brand} attachments carry EN 10204-3.1 mill certificates.`,
              },
              {
                Icon: Wrench,
                title: 'OEM Pin Match',
                desc: `Every attachment machined to ${brand.brand} OEM pin specifications. No adapters, no custom fabrication on your end. Drop-in fit guaranteed or we re-machine at our cost.`,
              },
              {
                Icon: MapPin,
                title: 'Canadian Company',
                desc: 'Boreal Iron Heavy Inc. is a Canadian corporation. All orders invoiced in CAD, shipped via Manitoulin LTL from our Ontario distribution point. QBO-integrated invoicing.',
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ borderTop: '3px solid #ffc500', paddingTop: '24px' }}>
                <Icon size={20} color="#1a1a1a" style={{ marginBottom: '14px' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1a1a1a', marginBottom: '10px' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '13px', color: '#777', fontWeight: 300, lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '64px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 36px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Ready to Order for<br />Your {brand.shortName}?
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: 300, marginTop: '10px' }}>
              Submit your machine model — we'll confirm fitment and price within 48 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/contact" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', padding: '16px 36px', backgroundColor: '#ffc500', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              Request Quote <ArrowRight size={14} />
            </Link>
            <Link to="/compatibility" style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '0.15em', padding: '16px 36px', border: '1.5px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>
              Compatibility Tool
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
