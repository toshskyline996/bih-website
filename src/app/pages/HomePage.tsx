import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Snowflake, ShieldCheck, Factory, Truck, ArrowRight } from 'lucide-react';
import { products, categoryLabels, type ProductCategory } from '../data/products';

const heroImg =
  'https://images.unsplash.com/photo-1714736834706-7e9dba1da6cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF2eSUyMGV4Y2F2YXRvciUyMGF0dGFjaG1lbnQlMjBpbmR1c3RyaWFsJTIwc3RlZWwlMjBmYWN0b3J5fGVufDF8fHx8MTc3NDc2NTAxOXww&ixlib=rb-4.1.0&q=80&w=1080';
const img1 =
  'https://images.unsplash.com/photo-1724555959431-a9db1c2fb66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyYXVsaWMlMjBidWNrZXQlMjBleGNhdmF0b3IlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc3NDc2NTAxOXww&ixlib=rb-4.1.0&q=80&w=1080';
const img2 =
  'https://images.unsplash.com/photo-1730584475795-f0be0efd606e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMHdlbGRpbmclMjBzcGFya3MlMjBpbmR1c3RyaWFsJTIwbWFudWZhY3R1cmluZ3xlbnwxfHx8fDE3NzQ3NjUwMjF8MA&ixlib=rb-4.1.0&q=80&w=1080';
const img3 =
  'https://images.unsplash.com/photo-1715738869412-3f4721475524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBlcXVpcG1lbnQlMjBncmFwcGxlJTIwYXR0YWNobWVudCUyMGNyYW5lfGVufDF8fHx8MTc3NDc2NTAyMnww&ixlib=rb-4.1.0&q=80&w=1080';

const productImages: Record<string, string> = {
  'bkt-hd-01': img1,
  'bkt-hd-02': img1,
  'bkt-mini-01': img1,
  'rak-01': img2,
  'rak-02': img2,
  'brk-01': img3,
  'brk-02': img3,
  'cpl-01': img2,
  'thm-01': img3,
  'rip-01': img2,
  'aug-01': img3,
};

const valueProps = [
  {
    icon: Snowflake,
    title: 'Sub-Zero Rated',
    desc: 'Q355 HSLA steel body with Hardox 450 wear parts — engineered for Canadian winter ground conditions down to −40°C.',
    link: '/steel-spec',
    linkText: 'View Steel Specs',
  },
  {
    icon: ShieldCheck,
    title: 'OEM Compatible',
    desc: 'Fits CAT, Komatsu, Volvo, Hitachi, John Deere, Kubota, and Bobcat pin configurations without adapters.',
    link: '/products',
    linkText: 'Browse Products',
  },
  {
    icon: Factory,
    title: 'Source Facility',
    desc: '60,000 m² ISO 9001-certified global manufacturing hub. Robotic welding, CNC plasma, ultrasonic weld inspection.',
    link: '/about',
    linkText: 'Our Story',
  },
  {
    icon: Truck,
    title: 'Factory Direct',
    desc: 'Zero middlemen. Direct from our Shandong facility to your Canadian job site. 6–10 week lead time FOB Qingdao.',
    link: '/contact',
    linkText: 'Get a Quote',
  },
];

const featuredIds = ['bkt-hd-01', 'cpl-01', 'brk-01'];
const featuredProducts = featuredIds.map((id) => products.find((p) => p.id === id)!);

const IL = { fontFamily: "'Inter', sans-serif" };

export function HomePage({ lang = 'en' }: { lang?: string }) {
  const [loaded, setLoaded] = useState(false);
  const isFr = lang === 'fr';

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={IL}>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ height: '100svh', minHeight: '620px', background: '#0d0d0d' }}
      >
        <img
          src={heroImg}
          alt="BIH excavator attachment"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: loaded ? 0.42 : 0,
            transition: 'opacity 1.4s ease',
            filter: 'saturate(0.25) contrast(1.1)',
          }}
          onLoad={() => setLoaded(true)}
        />
        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{
            fontSize: 'clamp(160px, 33vw, 480px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.06)',
            lineHeight: 1,
          }}
        >
          BIH
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-8 md:px-16 max-w-[1400px] mx-auto">
          <div
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1s ease 0.4s, transform 1s ease 0.4s',
            }}
          >
            <p style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
              {isFr ? 'Source Directe · Shandong, CN → Canada' : 'Factory Direct · Shandong, CN → Canada'}
            </p>
            <h1 style={{ fontSize: 'clamp(34px, 6vw, 84px)', fontWeight: 900, color: '#fff', lineHeight: 1.02, letterSpacing: '-0.025em', textTransform: 'uppercase', maxWidth: '720px' }}>
              {isFr ? 'L\'Acier\ndu Nord.' : 'The Steel\nof the North.'}
            </h1>
          </div>

          <div style={{ width: '52px', height: '1.5px', backgroundColor: 'rgba(255,255,255,0.35)', margin: '24px 0', opacity: loaded ? 1 : 0, transition: 'opacity 1s ease 0.7s' }} />

          <div
            className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 1s ease 0.9s, transform 1s ease 0.9s' }}
          >
            <p style={{ fontSize: 'clamp(13px, 1.4vw, 16px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: '380px', fontWeight: 300 }}>
              {isFr
                ? 'Godets, brise-roches, attaches rapides en acier Q355 — expédiés directement au Canada.'
                : 'Premium Q355 steel excavator attachments — buckets, breakers, quick couplers — engineered for Canadian heavy-duty demands.'}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/products"
                style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', padding: '14px 32px', backgroundColor: '#fff', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', transition: 'opacity 0.2s' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.85')}
                onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}
              >
                {isFr ? 'Voir les Produits' : 'View Products'}
              </Link>
              <Link
                to="/contact"
                style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '0.18em', padding: '14px 32px', border: '1.5px solid rgba(255,255,255,0.45)', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}
              >
                {isFr ? 'Demander un Devis' : 'Get Quote'}
              </Link>
            </div>
          </div>
        </div>

        {/* Cert badges */}
        <div className="absolute top-28 right-8 md:right-16 flex flex-col gap-2">
          {['CE CERTIFIED', 'ISO 9001', 'EN 474'].map((cert) => (
            <div key={cert} style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.2em', padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              {cert}
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="bg-white" style={{ padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            {valueProps.map((vp) => (
              <div key={vp.title} className="flex flex-col">
                <div style={{ width: '44px', height: '44px', backgroundColor: '#ffc500', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', flexShrink: 0 }}>
                  <vp.icon size={20} color="#1a1a1a" />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.06em', color: '#1a1a1a', textTransform: 'uppercase', marginBottom: '10px' }}>{vp.title}</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.8, fontWeight: 300, flexGrow: 1 }}>{vp.desc}</p>
                <Link
                  to={vp.link}
                  className="flex items-center gap-1 mt-4"
                  style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.15em', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.5')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}
                >
                  {vp.linkText} <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '40px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '20+', label: isFr ? 'Années de fabrication' : 'Years Manufacturing' },
              { val: '7', label: isFr ? 'Catégories de produits' : 'Product Categories' },
              { val: '10+', label: isFr ? 'Modèles disponibles' : 'Models Available' },
              { val: '99.7%', label: isFr ? 'Taux de qualité' : 'Quality Pass Rate' },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#ffc500', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: '10px', fontWeight: 300, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: '8px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '100px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '10px' }}>
                {isFr ? '01 — Produits Vedettes' : '01 — Featured Products'}
              </p>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 52px)', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1 }}>
                {isFr ? 'Équipements\nde Premier Plan' : 'Premier\nAttachments'}
              </h2>
            </div>
            <Link
              to="/products"
              style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.2em', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid #1a1a1a', paddingBottom: '2px', whiteSpace: 'nowrap' }}
            >
              {isFr ? 'Voir tout →' : 'View all →'}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => {
              const imgSrc = productImages[product.id] || img1;
              const isLarge = i === 0;
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group relative overflow-hidden block"
                  style={{ border: '10px solid #f0f0f0', textDecoration: 'none', transition: 'box-shadow 0.35s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 20px 50px rgba(0,0,0,0.12)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
                >
                  <div style={{ height: isLarge ? 'clamp(280px, 36vh, 440px)' : 'clamp(200px, 26vh, 320px)', overflow: 'hidden' }}>
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      style={{ filter: 'saturate(0.2) contrast(1.05)' }}
                    />
                  </div>
                  {product.tag && (
                    <div style={{ position: 'absolute', top: '14px', left: '14px', fontSize: '8px', fontWeight: 600, letterSpacing: '0.2em', padding: '4px 10px', backgroundColor: '#333', color: '#fff', textTransform: 'uppercase' }}>
                      {product.tag}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '4px' }}>
                      {isFr ? product.categoryLabelFr : product.categoryLabel}
                    </p>
                    <p style={{ fontSize: isLarge ? '18px' : '15px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                      {isFr ? product.nameFr : product.name}
                    </p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, marginTop: '4px' }}>{product.tonnageLabel}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATEGORY STRIP ── */}
      <section className="bg-white" style={{ padding: '64px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '28px' }}>
            {isFr ? 'Catégories' : 'Browse by Category'}
          </p>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(categoryLabels) as ProductCategory[]).map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', padding: '9px 18px', border: '1px solid #ddd', color: '#444', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.backgroundColor = '#1a1a1a'; (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.borderColor = '#1a1a1a'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.backgroundColor = 'transparent'; (e.target as HTMLElement).style.color = '#444'; (e.target as HTMLElement).style.borderColor = '#ddd'; }}
              >
                {isFr ? (categoryLabels as never)[cat] : categoryLabels[cat]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAR ── */}
      <section style={{ backgroundColor: '#ffc500', padding: '56px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {isFr ? 'Prêt à Commander ?' : 'Ready to Order?'}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(26,26,26,0.6)', fontWeight: 300, marginTop: '8px' }}>
              {isFr ? 'Délai: 6–10 semaines · Certifié ISO 9001 · Sans intermédiaire' : '6–10 Week Lead Time · ISO 9001 Certified · No Middlemen'}
            </p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link to="/contact" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', padding: '14px 32px', backgroundColor: '#1a1a1a', color: '#fff', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', transition: 'opacity 0.2s' }}>
              {isFr ? 'Demander un Devis' : 'Request Quote'}
            </Link>
            <Link to="/steel-spec" style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '0.18em', padding: '14px 32px', border: '1.5px solid rgba(26,26,26,0.4)', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s' }}>
              {isFr ? 'Voir les Spécs' : 'Steel Specs'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
