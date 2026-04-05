import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, CheckCircle, ChevronRight, ShoppingCart, Check } from 'lucide-react';
import { getProductBySlug } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { NameplateBadge } from '../components/NameplateBadge';

const img1 = 'https://images.unsplash.com/photo-1724555959431-a9db1c2fb66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyYXVsaWMlMjBidWNrZXQlMjBleGNhdmF0b3IlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc3NDc2NTAxOXww&ixlib=rb-4.1.0&q=80&w=1080';
const img2 = 'https://images.unsplash.com/photo-1730584475795-f0be0efd606e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMHdlbGRpbmclMjBzcGFya3MlMjBpbmR1c3RyaWFsJTIwbWFudWZhY3R1cmluZ3xlbnwxfHx8fDE3NzQ3NjUwMjF8MA&ixlib=rb-4.1.0&q=80&w=1080';
const img3 = 'https://images.unsplash.com/photo-1715738869412-3f4721475524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBlcXVpcG1lbnQlMjBncmFwcGxlJTIwYXR0YWNobWVudCUyMGNyYW5lfGVufDF8fHx8MTc3NDc2NTAyMnww&ixlib=rb-4.1.0&q=80&w=1080';

const productImages: Record<string, string> = {
  'bkt-hd-01': img1, 'bkt-hd-02': img1, 'bkt-mini-01': img1,
  'rak-01': img2, 'rak-02': img2, 'brk-01': img3, 'brk-02': img3,
  'cpl-01': img2, 'thm-01': img3, 'rip-01': img2, 'aug-01': img3,
};

const IL = { fontFamily: "'Inter', sans-serif" };
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;

export function ProductDetailPage({ lang = 'en' }: { lang?: string }) {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const [formSent, setFormSent] = useState(false);
  const [inquiry, setInquiry] = useState({ name: '', company: '', email: '', message: '' });
  const [addedToCart, setAddedToCart] = useState(false);
  const isFr = lang === 'fr';
  const [rbaListings, setRbaListings] = useState<{ title: string; price_cad: number; sale_date: string }[]>([]);

  useEffect(() => {
    const cacheKey = 'rba-public-cache';
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { ts, data } = JSON.parse(cached);
        if (Date.now() - ts < 24 * 60 * 60 * 1000) { setRbaListings(data); return; }
      } catch { /* ignore */ }
    }
    fetch('https://intel-api.freightracing.ca/query/rba-public')
      .then(r => r.json())
      .then((res: { ok: boolean; data: { title: string; price_cad: number; sale_date: string }[] }) => {
        if (res.ok && res.data?.length) {
          setRbaListings(res.data);
          localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: res.data }));
        }
      })
      .catch(() => {});
  }, []);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({ productId: product.id, name: product.name, priceCad: product.priceCad, weightKg: product.weightKg });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product) {
    return (
      <div style={{ ...IL, padding: '120px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase' }}>
          {isFr ? 'Produit Introuvable' : 'Product Not Found'}
        </h1>
        <Link to="/products" style={{ fontSize: '12px', color: '#555', textDecoration: 'none', marginTop: '16px', display: 'inline-block' }}>
          ← {isFr ? 'Retour aux Produits' : 'Back to Products'}
        </Link>
      </div>
    );
  }

  const imgSrc = productImages[product.id] || img1;
  const name = isFr ? product.nameFr : product.name;
  const description = isFr ? product.descriptionFr : product.description;
  const features = isFr ? product.featuresFr : product.features;
  const specs = isFr ? product.specsFr : product.specs;
  const catLabel = isFr ? product.categoryLabelFr : product.categoryLabel;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...inquiry, product: product?.name, productId: product?.id };
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `BIH Inquiry — ${product?.name} — ${inquiry.name}`,
        from_name: 'BIH Website',
        ...payload,
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.success) {
          setFormSent(true);
          fetch('https://n8n.freightracing.ca/webhook/bih-quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(() => {});
        }
      })
      .catch(() => setFormSent(true));
  };

  return (
    <div style={IL}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#f5f5f5', padding: '14px 0', borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 flex items-center gap-2">
          <Link to="/products" className="flex items-center gap-1" style={{ fontSize: '11px', color: '#888', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 300 }}>
            <ArrowLeft size={12} />
            {isFr ? 'Produits' : 'Products'}
          </Link>
          <ChevronRight size={10} color="#bbb" />
          <span style={{ fontSize: '11px', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 400 }}>{catLabel}</span>
        </div>
      </div>

      {/* Main */}
      <section style={{ backgroundColor: '#fff', padding: '60px 0 80px' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Image */}
            <div className="relative">
              <div style={{ position: 'relative', overflow: 'hidden', border: '10px solid #f5f5f5' }}>
                <img
                  src={imgSrc}
                  alt={name}
                  className="w-full"
                  style={{ height: 'clamp(320px, 50vh, 520px)', objectFit: 'cover', filter: 'saturate(0.2) contrast(1.05)' }}
                />
                {product.tag && (
                  <div style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.2em', padding: '4px 12px', backgroundColor: '#333', color: '#fff', textTransform: 'uppercase' }}>
                    {product.tag}
                  </div>
                )}
              </div>
              {/* Cert badges */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {product.certificates.map((cert) => (
                  <span key={cert} style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.15em', padding: '4px 10px', backgroundColor: '#161616', color: '#FFC500', border: '1px solid rgba(255,197,0,0.4)', textTransform: 'uppercase' }}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '10px' }}>
                {catLabel} · {product.tonnageLabel}
              </p>
              <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 40px)', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '20px' }}>
                {name}
              </h1>
              <div style={{ width: '40px', height: '2px', backgroundColor: '#1a1a1a', marginBottom: '20px' }} />
              <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.85, fontWeight: 300, marginBottom: '28px' }}>{description}</p>

              {/* Material */}
              <div className="flex gap-6 mb-8 flex-wrap">
                <div>
                  <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#aaa', textTransform: 'uppercase', fontWeight: 300, marginBottom: '4px' }}>
                    {isFr ? 'Corps' : 'Body'}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>{product.material.body}</p>
                </div>
                <div>
                  <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#aaa', textTransform: 'uppercase', fontWeight: 300, marginBottom: '4px' }}>
                    {isFr ? 'Pièces d\'usure' : 'Wear Parts'}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>{product.material.wearParts}</p>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-8">
                <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#aaa', textTransform: 'uppercase', fontWeight: 300, marginBottom: '8px' }}>
                  {isFr ? 'Marques compatibles' : 'Compatible Brands'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.compatibleBrands.map((brand) => (
                    <span key={brand} style={{ fontSize: '10px', fontWeight: 400, letterSpacing: '0.1em', padding: '4px 10px', border: '1px solid #ddd', color: '#555', textTransform: 'uppercase' }}>
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price + Add to Cart */}
              <div className="mb-6 flex items-baseline gap-3">
                <span style={{ fontSize: '28px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                  {product.priceCad.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })}
                </span>
                <span style={{ fontSize: '11px', color: '#999', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}>CAD · ex. tax &amp; shipping</span>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em',
                    padding: '14px 28px',
                    backgroundColor: addedToCart ? '#16a34a' : '#FFC500',
                    color: addedToCart ? '#fff' : '#003366',
                    textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  {addedToCart
                    ? <><Check size={14} /> {isFr ? 'Ajouté!' : 'Added!'}</>
                    : <><ShoppingCart size={14} /> {isFr ? 'Ajouter au Panier' : 'Add to Cart'}</>}
                </button>
                <a
                  href="#inquire"
                  style={{ display: 'inline-block', fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', padding: '14px 28px', backgroundColor: '#1a1a1a', color: '#fff', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.opacity = '0.8')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.opacity = '1')}
                >
                  {isFr ? 'Demander un Devis' : 'Request Quote'}
                </a>
              </div>
              <Link to="/contact" style={{ display: 'inline-block', fontSize: '12px', fontWeight: 400, letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid #ccc', paddingBottom: '2px' }}>
                {isFr ? 'Nous Contacter' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specs & Features */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Specs */}
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '20px' }}>
                {isFr ? 'Spécifications Techniques' : 'Technical Specifications'}
              </p>
              <table className="w-full border-collapse">
                <tbody>
                  {Object.entries(specs).map(([key, val], i) => (
                    <tr key={key} style={{ borderBottom: '1px solid #ebebeb', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                      <td style={{ fontSize: '12px', color: '#777', fontWeight: 300, padding: '14px 0', letterSpacing: '0.02em' }}>{key}</td>
                      <td style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: 600, padding: '14px 0 14px 16px', letterSpacing: '0.02em' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Features */}
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: '#999', textTransform: 'uppercase', fontWeight: 300, marginBottom: '20px' }}>
                {isFr ? 'Caractéristiques Clés' : 'Key Features'}
              </p>
              <div className="flex flex-col gap-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={15} color="#ffc500" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ fontSize: '13px', color: '#444', fontWeight: 300, lineHeight: 1.6 }}>{f}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Material Trust Strip */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '48px 0', borderBottom: '1px solid #252525' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <p style={{ fontSize: '10px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '12px' }}>
                {isFr ? 'Standard Matière' : 'Material Standard'}
              </p>
              <div className="flex flex-wrap gap-3 mb-4">
                {[
                  { badge: 'Q355D HSLA', sub: isFr ? 'Corps Structural' : 'Structural Body' },
                  { badge: '450 HBW', sub: isFr ? 'Pièces d\'Usure' : 'Wear Plate' },
                  { badge: 'ISO 9001', sub: isFr ? 'Atelier Certifié' : 'Certified Facility' },
                  { badge: 'AWS D1.1', sub: isFr ? 'Soudage Robot.' : 'Robotic Weld' },
                  { badge: '−40°C', sub: isFr ? 'Cert. Impact Froid' : 'Cold Impact Rated' },
                ].map((b) => (
                  <div key={b.badge} style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#ffc500', letterSpacing: '0.06em' }}>{b.badge}</p>
                    <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 300, marginTop: '2px' }}>{b.sub}</p>
                  </div>
                ))}
              </div>
              <Link to="/steel-spec" style={{ fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 300, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '1px' }}>
                {isFr ? 'Voir spécifications acier complètes →' : 'View full steel spec sheet →'}
              </Link>
            </div>
            <div style={{ backgroundColor: 'rgba(255,197,0,0.06)', border: '1px solid rgba(255,197,0,0.18)', padding: '20px 22px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '8px' }}>
                {isFr ? 'Vérifier la Compatibilité' : 'Check Compatibility'}
              </p>
              <p style={{ fontSize: '13px', color: '#fff', fontWeight: 400, lineHeight: 1.6, marginBottom: '14px' }}>
                {isFr
                  ? 'Confirm que cet accessoire s\'adapte à votre excavatrice sans adaptateur.'
                  : 'Confirm this attachment fits your excavator — direct-fit, no adapters.'}
              </p>
              <Link to="/compatibility" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', padding: '10px 20px', backgroundColor: '#ffc500', color: '#1a1a1a', textTransform: 'uppercase', textDecoration: 'none' }}>
                {isFr ? 'Outil OEM →' : 'OEM Finder →'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RBA Market Intelligence Widget */}
      {rbaListings.length > 0 && (
        <section style={{ backgroundColor: '#111', padding: '32px 0', borderBottom: '1px solid #1e1e1e' }}>
          <div className="max-w-[1400px] mx-auto px-8 md:px-16">
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '16px' }}>
              {isFr ? 'Marché — Ventes Récentes' : 'Market Intelligence — Recent Auction Sales'}
            </p>
            <div className="flex flex-wrap gap-4 items-end">
              {rbaListings.map((item, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 18px', minWidth: '200px' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.4, marginBottom: '6px' }}>{item.title}</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#ffc500', letterSpacing: '-0.02em' }}>
                    CAD ${item.price_cad.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontWeight: 300, marginTop: '2px' }}>{item.sale_date}</p>
                </div>
              ))}
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontWeight: 300, maxWidth: '240px', lineHeight: 1.7 }}>
                {isFr
                  ? 'Protégez cet investissement avec des accessoires BIH Q355.'
                  : 'Protect this investment with BIH Q355 attachments.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Factory Nameplate */}
      <section style={{ backgroundColor: '#0E0E0E', padding: '48px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '20px', fontFamily: "'Inter', sans-serif" }}>
            {isFr ? '03 — Plaque d\'Identification' : '03 — Factory Nameplate'}
          </p>
          <div className="max-w-[640px]">
            <NameplateBadge product={product} lang={lang} />
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="inquire" style={{ backgroundColor: '#1a1a1a', padding: '80px 0' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
                {isFr ? 'Demande de Devis' : 'Request a Quote'}
              </p>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '20px' }}>
                {isFr ? 'Intéressé par\nce Produit?' : 'Interested in\nThis Product?'}
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.8, maxWidth: '340px' }}>
                {isFr
                  ? `Vous demandez un devis pour: ${product.nameFr}. Notre équipe répondra sous 48h.`
                  : `You're enquiring about: ${product.name}. Our team will respond with pricing and lead time within 48 hours.`}
              </p>
            </div>
            <div>
              {formSent ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '32px' }}>
                  <div style={{ width: '40px', height: '1.5px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
                  <p style={{ fontSize: '24px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>
                    {isFr ? 'Reçu!' : 'Inquiry Received'}
                  </p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 300, lineHeight: 1.8 }}>
                    {isFr ? "Notre équipe vous contactera dans les 48h." : "Our team will respond within 48 hours."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: isFr ? 'Nom' : 'Full Name', key: 'name', ph: 'John Smith' },
                      { label: isFr ? 'Entreprise' : 'Company', key: 'company', ph: 'Acme Construction' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: 300 }}>{f.label}</label>
                        <input
                          type="text"
                          placeholder={f.ph}
                          value={(inquiry as Record<string, string>)[f.key]}
                          onChange={e => setInquiry({ ...inquiry, [f.key]: e.target.value })}
                          style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #444', color: '#fff', fontSize: '13px', fontWeight: 300, padding: '10px 0', outline: 'none', fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: 300 }}>Email</label>
                    <input
                      type="email"
                      required
                      value={inquiry.email}
                      onChange={e => setInquiry({ ...inquiry, email: e.target.value })}
                      placeholder="john@company.ca"
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #444', color: '#fff', fontSize: '13px', fontWeight: 300, padding: '10px 0', outline: 'none', fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: 300 }}>
                      {isFr ? 'Message / Quantité' : 'Message / Quantity'}
                    </label>
                    <textarea
                      rows={3}
                      value={inquiry.message}
                      onChange={e => setInquiry({ ...inquiry, message: e.target.value })}
                      placeholder={isFr ? "ex: 2 unités, livraison Alberta..." : "e.g. qty 2, delivery to Alberta..."}
                      style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #444', color: '#fff', fontSize: '13px', fontWeight: 300, padding: '10px 0', outline: 'none', resize: 'none', fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ alignSelf: 'flex-start', fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', padding: '14px 36px', backgroundColor: '#fff', color: '#1a1a1a', border: 'none', textTransform: 'uppercase', cursor: 'pointer', transition: 'opacity 0.2s' }}
                  >
                    {isFr ? 'Envoyer' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
