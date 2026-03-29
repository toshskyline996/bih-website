import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle';
import { products, categoryLabels, categoryLabelsFr, type ProductCategory } from '../data/products';

const img1 = 'https://images.unsplash.com/photo-1724555959431-a9db1c2fb66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyYXVsaWMlMjBidWNrZXQlMjBleGNhdmF0b3IlMjBjb25zdHJ1Y3Rpb24lMjBzaXRlfGVufDF8fHx8MTc3NDc2NTAxOXww&ixlib=rb-4.1.0&q=80&w=1080';
const img2 = 'https://images.unsplash.com/photo-1730584475795-f0be0efd606e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMHdlbGRpbmclMjBzcGFya3MlMjBpbmR1c3RyaWFsJTIwbWFudWZhY3R1cmluZ3xlbnwxfHx8fDE3NzQ3NjUwMjF8MA&ixlib=rb-4.1.0&q=80&w=1080';
const img3 = 'https://images.unsplash.com/photo-1715738869412-3f4721475524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBlcXVpcG1lbnQlMjBncmFwcGxlJTIwYXR0YWNobWVudCUyMGNyYW5lfGVufDF8fHx8MTc3NDc2NTAyMnww&ixlib=rb-4.1.0&q=80&w=1080';

const productImages: Record<string, string> = {
  'bkt-hd-01': img1, 'bkt-hd-02': img1, 'bkt-mini-01': img1,
  'rak-01': img2, 'rak-02': img2, 'brk-01': img3, 'brk-02': img3,
  'cpl-01': img2, 'thm-01': img3, 'rip-01': img2, 'aug-01': img3,
};

const IL = { fontFamily: "'Inter', sans-serif" };
const categories = Object.keys(categoryLabels) as ProductCategory[];

export function ProductsPage({ lang = 'en' }: { lang?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCat = (searchParams.get('category') as ProductCategory) || '';
  const [activeCategory, setActiveCategory] = useState<ProductCategory | ''>(initCat);
  const [hovered, setHovered] = useState<string | null>(null);
  const isFr = lang === 'fr';
  usePageTitle('All Products — Excavator Attachments', 'Tous les Produits — Accessoires Excavateur', lang);

  useEffect(() => {
    const cat = searchParams.get('category') as ProductCategory | null;
    setActiveCategory(cat || '');
  }, [searchParams]);

  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products;

  const handleCategory = (cat: ProductCategory | '') => {
    setActiveCategory(cat);
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <div style={IL}>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '80px 0 60px' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '12px' }}>
            {isFr ? 'Catalogue Complet' : 'Full Catalogue'}
          </p>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 64px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {isFr ? 'Tous les\nProduits' : 'All\nProducts'}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: 300, marginTop: '16px', maxWidth: '480px', lineHeight: 1.7 }}>
            {isFr
              ? `${products.length} modèles disponibles · Q355 + Hardox 450 · Livraison directe au Canada`
              : `${products.length} models available · Q355 + Hardox 450 · Direct to Canada`}
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section style={{ backgroundColor: '#f5f5f5', padding: '20px 0', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: '80px', zIndex: 40 }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => handleCategory('')}
              style={{ fontSize: '10px', fontWeight: activeCategory === '' ? 600 : 400, letterSpacing: '0.18em', padding: '7px 16px', backgroundColor: activeCategory === '' ? '#1a1a1a' : 'transparent', color: activeCategory === '' ? '#fff' : '#555', border: `1px solid ${activeCategory === '' ? '#1a1a1a' : '#ccc'}`, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {isFr ? 'Tous' : 'All'} ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              const label = isFr ? categoryLabelsFr[cat] : categoryLabels[cat];
              return (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  style={{ fontSize: '10px', fontWeight: activeCategory === cat ? 600 : 400, letterSpacing: '0.18em', padding: '7px 16px', backgroundColor: activeCategory === cat ? '#1a1a1a' : 'transparent', color: activeCategory === cat ? '#fff' : '#555', border: `1px solid ${activeCategory === cat ? '#1a1a1a' : '#ccc'}`, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section style={{ backgroundColor: '#fff', padding: '60px 0 100px' }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => {
              const imgSrc = productImages[product.id] || img1;
              const isHov = hovered === product.id;
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="relative overflow-hidden block"
                  style={{ border: '8px solid #f5f5f5', textDecoration: 'none', boxShadow: isHov ? '0 16px 48px rgba(0,0,0,0.10)' : 'none', transition: 'box-shadow 0.35s' }}
                  onMouseEnter={() => setHovered(product.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div style={{ height: 'clamp(200px, 26vh, 300px)', overflow: 'hidden' }}>
                    <img
                      src={imgSrc}
                      alt={isFr ? product.nameFr : product.name}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.2) contrast(1.05)', transform: isHov ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.7s ease' }}
                    />
                  </div>
                  {product.tag && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '8px', fontWeight: 600, letterSpacing: '0.2em', padding: '3px 9px', backgroundColor: '#333', color: '#fff', textTransform: 'uppercase' }}>
                      {product.tag}
                    </div>
                  )}
                  {/* Cert badges */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                    {product.certificates.slice(0, 2).map((cert) => (
                      <span key={cert} style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.15em', padding: '2px 6px', backgroundColor: 'rgba(255,197,0,0.9)', color: '#1a1a1a' }}>
                        {cert}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 100%)' }}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '4px' }}>
                      {isFr ? product.categoryLabelFr : product.categoryLabel} · {product.tonnageLabel}
                    </p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                      {isFr ? product.nameFr : product.name}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 300, marginTop: '4px', opacity: isHov ? 1 : 0, transform: isHov ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.3s, transform 0.3s' }}>
                      {isFr ? product.descriptionFr.slice(0, 80) : product.description.slice(0, 80)}…
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center" style={{ padding: '80px 0' }}>
              <p style={{ fontSize: '14px', color: '#999', fontWeight: 300 }}>
                {isFr ? 'Aucun produit trouvé.' : 'No products found.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
