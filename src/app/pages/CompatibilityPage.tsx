import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Search, ChevronDown, CheckCircle2, AlertCircle, ArrowRight, X, Tag } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { brandData, type BrandData, type MachineModel } from '../data/compatibility';
import { products, type Product } from '../data/products';

const IL = { fontFamily: "'Inter', sans-serif" };

// ─── Analytics helper ────────────────────────────────────────────────────────
function fireCompatEvent(payload: Record<string, unknown>) {
  fetch('/api/track-compat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, ts: new Date().toISOString() }),
  }).catch(() => {});
}

// ─── localStorage key ─────────────────────────────────────────────────────────
const LS_KEY = 'bih-compat-last';

// ─── Category display helpers ─────────────────────────────────────────────────
const categoryLabel: Record<string, string> = {
  bucket:       'Excavator Bucket',
  'rack-bucket':'Skeleton Bucket',
  breaker:      'Hydraulic Breaker',
  coupler:      'Quick Coupler',
  thumb:        'Hydraulic Thumb',
  ripper:       'Ripper',
  auger:        'Auger',
};
const categoryLabelFr: Record<string, string> = {
  bucket:       'Godet',
  'rack-bucket':'Godet squelette',
  breaker:      'Brise-roche',
  coupler:      'Attache rapide',
  thumb:        'Pouce hydraulique',
  ripper:       'Dent de défonçage',
  auger:        'Tarière',
};

// ─── Main page ────────────────────────────────────────────────────────────────
export function CompatibilityPage({ lang = 'en' }: { lang?: string }) {
  const isFr = lang === 'fr';
  usePageTitle(
    'OEM Compatibility Tool — Find Your Machine',
    'Outil de Compatibilité OEM — Trouvez Votre Machine',
    lang,
  );

  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (!saved) return null;
      const { brandName } = JSON.parse(saved) as { brandName: string; modelName: string };
      return brandData.find((b) => b.brand === brandName) ?? null;
    } catch { return null; }
  });
  const [selectedModel, setSelectedModel] = useState<MachineModel | null>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (!saved) return null;
      const { brandName, modelName } = JSON.parse(saved) as { brandName: string; modelName: string };
      const brand = brandData.find((b) => b.brand === brandName);
      return brand?.models.find((m) => m.model === modelName) ?? null;
    } catch { return null; }
  });
  const [brandOpen, setBrandOpen]         = useState(false);
  const [modelOpen, setModelOpen]         = useState(false);
  const [search, setSearch]               = useState('');

  const filteredBrandModels = useMemo(() => {
    if (!selectedBrand) return [];
    if (!search.trim()) return selectedBrand.models;
    return selectedBrand.models.filter((m) =>
      m.model.toLowerCase().includes(search.toLowerCase()),
    );
  }, [selectedBrand, search]);

  const compatibleProducts = useMemo<Product[]>(() => {
    if (!selectedModel) return [];
    return products.filter(
      (p) =>
        selectedModel.tonnage >= p.tonnageRange[0] &&
        selectedModel.tonnage <= p.tonnageRange[1],
    );
  }, [selectedModel]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      localStorage.setItem(LS_KEY, JSON.stringify({ brandName: selectedBrand.brand, modelName: selectedModel.model }));
    } else if (!selectedBrand) {
      localStorage.removeItem(LS_KEY);
    }
  }, [selectedBrand, selectedModel]);

  const handleBrandSelect = useCallback((b: BrandData | null) => {
    setSelectedBrand(b);
    setSelectedModel(null);
    setSearch('');
    if (b) fireCompatEvent({ event: 'brand_selected', brand: b.shortName });
  }, []);

  const handleModelSelect = useCallback((m: MachineModel, brand: BrandData) => {
    setSelectedModel(m);
    setModelOpen(false);
    const productCount = products.filter(
      (p) => m.tonnage >= p.tonnageRange[0] && m.tonnage <= p.tonnageRange[1]
    ).length;
    fireCompatEvent({ event: 'model_selected', brand: brand.shortName, model: m.model, tonnage: m.tonnage, productCount });
    if (productCount === 0) {
      fireCompatEvent({ event: 'no_results', brand: brand.shortName, model: m.model, tonnage: m.tonnage });
    }
  }, []);

  const reset = () => {
    setSelectedBrand(null);
    setSelectedModel(null);
    setSearch('');
    setBrandOpen(false);
    setModelOpen(false);
  };

  return (
    <div style={IL}>
      {/* ── Hero ── */}
      <section style={{ backgroundColor: '#111', padding: '72px 0 56px' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '12px' }}>
            {isFr ? 'Outils Techniques' : 'Technical Tools'}
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 56px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.025em', lineHeight: 1.0, marginBottom: '16px' }}>
            {isFr ? 'Outil de\nCompatibilité OEM' : 'OEM Compatibility\nFinder'}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.8, maxWidth: '520px' }}>
            {isFr
              ? 'Sélectionnez votre marque et modèle d\'excavatrice pour voir immédiatement quels accessoires BIH s\'adaptent à vos axes de fixation.'
              : 'Select your excavator make and model to instantly see which BIH attachments fit your pin configuration — no adapters required.'}
          </p>
        </div>
      </section>

      {/* ── Brand Quick-Select ── */}
      <section style={{ backgroundColor: '#161616', padding: '32px 0', borderBottom: '1px solid #222' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '16px' }}>
            {isFr ? 'Sélection rapide par marque' : 'Quick select by brand'}
          </p>
          <div className="flex flex-wrap gap-2">
            {brandData.map((b) => {
              const isActive = selectedBrand?.brand === b.brand;
              return (
                <button
                  key={b.brand}
                  onClick={() => handleBrandSelect(isActive ? null : b)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '8px 16px',
                    backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isActive ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                    color: isActive ? '#111' : 'rgba(255,255,255,0.7)',
                    fontSize: '11px', fontWeight: isActive ? 700 : 300,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: b.color, flexShrink: 0 }} />
                  {b.shortName}
                  <span style={{ fontSize: '9px', opacity: 0.5, marginLeft: '2px' }}>{b.models.length}</span>
                </button>
              );
            })}
          </div>
          {selectedBrand && (() => {
            const slugMap: Record<string, string> = {
              'CAT': 'cat', 'Komatsu': 'komatsu', 'Volvo': 'volvo',
              'Hitachi': 'hitachi', 'John Deere': 'john-deere',
              'Kubota': 'kubota', 'Bobcat': 'bobcat',
              'Doosan': 'doosan', 'Hyundai': 'hyundai', 'Kobelco': 'kobelco',
              'Case': 'case', 'Sany': 'sany',
            };
            const slug = slugMap[selectedBrand.shortName];
            return (
              <div style={{ marginTop: '14px' }}>
                <Link
                  to={`/excavator-attachments/${slug}`}
                  style={{ fontSize: '10px', letterSpacing: '0.2em', color: selectedBrand.color, textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}
                >
                  {isFr ? `Voir tous les accessoires ${selectedBrand.shortName} →` : `View all ${selectedBrand.shortName} attachments →`}
                </Link>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── Finder Tool ── */}
      <section style={{ backgroundColor: '#1a1a1a', padding: '48px 0', borderBottom: '1px solid #2a2a2a' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

            {/* Brand selector */}
            <div>
              <label style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, display: 'block', marginBottom: '8px' }}>
                {isFr ? '① Marque' : '① Brand'}
              </label>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => { setBrandOpen(!brandOpen); setModelOpen(false); }}
                  style={{ width: '100%', backgroundColor: '#262626', border: '1px solid #333', color: selectedBrand ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: selectedBrand ? 500 : 300, padding: '12px 40px 12px 14px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  {selectedBrand
                    ? <><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedBrand.color, flexShrink: 0 }} />{selectedBrand.shortName}</>
                    : (isFr ? 'Sélectionner une marque' : 'Select brand')}
                  <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: `translateY(-50%) rotate(${brandOpen ? 180 : 0}deg)`, transition: 'transform 0.2s', color: 'rgba(255,255,255,0.4)' }} />
                </button>
                {brandOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#262626', border: '1px solid #333', zIndex: 50, maxHeight: '280px', overflowY: 'auto' }}>
                    {brandData.map((b) => (
                      <button
                        key={b.brand}
                        onClick={() => { handleBrandSelect(b); setBrandOpen(false); }}
                        style={{ width: '100%', padding: '11px 14px', textAlign: 'left', backgroundColor: selectedBrand?.brand === b.brand ? '#333' : 'transparent', color: '#fff', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', borderBottom: '1px solid #2a2a2a' }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: b.color, flexShrink: 0 }} />
                        {b.brand}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Model selector */}
            <div>
              <label style={{ fontSize: '10px', letterSpacing: '0.25em', color: selectedBrand ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)', textTransform: 'uppercase', fontWeight: 300, display: 'block', marginBottom: '8px' }}>
                {isFr ? '② Modèle' : '② Model'}
              </label>
              <div style={{ position: 'relative' }}>
                <button
                  disabled={!selectedBrand}
                  onClick={() => { setModelOpen(!modelOpen); setBrandOpen(false); }}
                  style={{ width: '100%', backgroundColor: selectedBrand ? '#262626' : '#1e1e1e', border: `1px solid ${selectedBrand ? '#333' : '#252525'}`, color: selectedModel ? '#fff' : 'rgba(255,255,255,0.25)', fontSize: '13px', fontWeight: selectedModel ? 500 : 300, padding: '12px 40px 12px 14px', textAlign: 'left', cursor: selectedBrand ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {selectedModel ? `${selectedBrand?.shortName} ${selectedModel.model}` : (isFr ? 'Sélectionner un modèle' : 'Select model')}
                  <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: `translateY(-50%) rotate(${modelOpen ? 180 : 0}deg)`, transition: 'transform 0.2s', color: 'rgba(255,255,255,0.3)' }} />
                </button>
                {modelOpen && selectedBrand && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#262626', border: '1px solid #333', zIndex: 50 }}>
                    <div style={{ padding: '8px', borderBottom: '1px solid #2a2a2a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e1e1e', padding: '8px 12px' }}>
                        <Search size={13} color="rgba(255,255,255,0.3)" />
                        <input
                          type="text"
                          placeholder={isFr ? 'Rechercher un modèle...' : 'Search model...'}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '12px', outline: 'none', width: '100%' }}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      {filteredBrandModels.map((m) => (
                        <button
                          key={m.model}
                          onClick={() => { if (selectedBrand) handleModelSelect(m, selectedBrand); }}
                          style={{ width: '100%', padding: '10px 14px', textAlign: 'left', backgroundColor: selectedModel?.model === m.model ? '#333' : 'transparent', color: '#fff', fontSize: '13px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', borderBottom: '1px solid #222' }}
                        >
                          <span>{m.model}</span>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{m.tonnage}T</span>
                        </button>
                      ))}
                      {filteredBrandModels.length === 0 && (
                        <p style={{ padding: '16px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>No models found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reset */}
            <div className="flex items-end">
              {(selectedBrand || selectedModel) ? (
                <button
                  onClick={reset}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 400, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 0' }}
                >
                  <X size={13} /> {isFr ? 'Réinitialiser' : 'Reset'}
                </button>
              ) : (
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontWeight: 300, paddingBottom: '13px' }}>
                  {isFr ? '← Commencez par choisir votre marque' : '← Start by selecting your brand'}
                </p>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Results ── */}
      {selectedModel && (
        <section style={{ backgroundColor: '#111', padding: '56px 0' }}>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">

            {/* Machine summary card */}
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '24px 28px', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ flexGrow: 1 }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '6px' }}>
                  {isFr ? 'Machine sélectionnée' : 'Selected machine'}
                </p>
                <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                  {selectedBrand?.shortName} {selectedModel.model}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 300, marginTop: '4px' }}>
                  {selectedModel.weightKg.toLocaleString()} kg · {selectedModel.tonnage}T {isFr ? 'classe' : 'class'}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3">
                {[
                  { label: isFr ? 'Ø Axe de bras'  : 'Arm Pin Ø',    val: `${selectedModel.armPinDiamMm} mm`  },
                  { label: isFr ? 'Ø Axe de flèche': 'Boom Pin Ø',   val: `${selectedModel.boomPinDiamMm} mm` },
                  { label: isFr ? 'Entraxe des axes': 'Pin Spacing',  val: `${selectedModel.pinSpacingMm} mm`  },
                  { label: isFr ? 'Largeur douille' : 'Bushing Width',val: `${selectedModel.bushingWidthMm} mm` },
                ].map((spec) => (
                  <div key={spec.label}>
                    <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300 }}>{spec.label}</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#FFC500', marginTop: '3px' }}>{spec.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatible products */}
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '20px' }}>
              {compatibleProducts.length} {isFr ? 'accessoires compatibles' : 'compatible attachments'} — {isFr ? 'ajustement direct, sans adaptateur' : 'direct-fit, no adapters required'}
            </p>

            {compatibleProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {compatibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} isFr={isFr} machine={selectedModel} brandShort={selectedBrand?.shortName ?? ''}
                    onProductClick={() => fireCompatEvent({ event: 'product_clicked', brand: selectedBrand?.shortName, model: selectedModel.model, productId: p.id, productName: p.name })} />
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '48px 32px', textAlign: 'center' }}>
                <AlertCircle size={28} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
                  {isFr ? 'Aucun produit standard disponible pour cette classe de tonnage.' : 'No standard products available for this tonnage class.'}
                </p>
                <Link to="/contact" style={{ display: 'inline-block', marginTop: '16px', fontSize: '11px', letterSpacing: '0.2em', color: '#FFC500', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 500 }}>
                  {isFr ? 'Demander un devis personnalisé →' : 'Request custom quote →'}
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Empty state / browse matrix ── */}
      {!selectedModel && (
        <section style={{ backgroundColor: '#111', padding: '56px 0' }}>
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '32px' }}>
              {isFr ? 'Ou parcourir par classe de tonnage' : 'Or browse by tonnage class'}
            </p>
            <TonnageMatrix isFr={isFr} />
          </div>
        </section>
      )}

      {/* ── Disclaimer ── */}
      <section style={{ backgroundColor: '#0d0d0d', padding: '32px 0', borderTop: '1px solid #1a1a1a' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontWeight: 300, lineHeight: 1.8, maxWidth: '720px' }}>
            {isFr
              ? '⚠ Les spécifications de broches sont fournies à titre indicatif selon les manuels OEM publics. Vérifiez toujours avec votre manuel de service avant la commande. BIH peut fabriquer des configurations de broches personnalisées sur demande.'
              : '⚠ Pin specifications are provided as a guide based on published OEM service manuals. Always verify with your machine\'s service manual before ordering. BIH can manufacture custom pin configurations on request.'}
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Product result card ───────────────────────────────────────────────────────
function ProductCard({ product, isFr, machine, brandShort, onProductClick }: {
  product: Product; isFr: boolean; machine: MachineModel; brandShort: string;
  onProductClick: () => void;
}) {
  const label = isFr ? categoryLabelFr[product.category] : categoryLabel[product.category];

  // Pin-spec fit check: product stores pin diameter in specs; cross-check arm pin
  const productPinMin = product.category === 'bucket' || product.category === 'rack-bucket'
    ? product.tonnageRange[0] <= 5 ? 30 : product.tonnageRange[0] <= 12 ? 50 : 65
    : null;
  const productPinMax = product.category === 'bucket' || product.category === 'rack-bucket'
    ? product.tonnageRange[0] <= 5 ? 45 : product.tonnageRange[0] <= 12 ? 62 : 100
    : null;
  const pinVerifyNeeded = productPinMin !== null && productPinMax !== null
    ? machine.armPinDiamMm < productPinMin || machine.armPinDiamMm > productPinMax
    : false;

  const quoteParams = new URLSearchParams({
    product: product.id,
    machine: `${brandShort} ${machine.model}`,
  }).toString();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', transition: 'border-color 0.2s' }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#FFC500')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a')}
    >
      <Link
        to={`/products/${product.slug}`}
        style={{ textDecoration: 'none', display: 'block', padding: '20px 22px 14px' }}
        onClick={onProductClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300 }}>{label}</p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.25, marginTop: '4px' }}>
              {isFr ? product.nameFr : product.name}
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 300, marginTop: '3px' }}>
              {product.tonnageLabel}
            </p>
          </div>
          {product.tag && (
            <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.12em', padding: '3px 7px', backgroundColor: '#FFC500', color: '#1a1a1a', textTransform: 'uppercase', flexShrink: 0 }}>
              {product.tag}
            </span>
          )}
        </div>

        {/* Fit badge */}
        {pinVerifyNeeded ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', backgroundColor: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', marginBottom: '10px' }}>
            <AlertCircle size={12} color="#facc15" />
            <p style={{ fontSize: '11px', color: '#facc15', fontWeight: 500 }}>
              {isFr ? `Vérifier les axes — ${machine.armPinDiamMm}mm Ø machine` : `Verify pin dims — machine is ${machine.armPinDiamMm}mm Ø`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', backgroundColor: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', marginBottom: '10px' }}>
            <CheckCircle2 size={12} color="#4ade80" />
            <p style={{ fontSize: '11px', color: '#4ade80', fontWeight: 500 }}>
              {isFr
                ? `Compatible ${brandShort} ${machine.model} — ajustement direct`
                : `Fits ${brandShort} ${machine.model} — direct-fit`}
            </p>
          </div>
        )}

        {/* Pin spec detail */}
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontWeight: 300, marginBottom: '12px' }}>
          {isFr ? 'Axe machine' : 'Machine pin'}: {machine.armPinDiamMm}mm Ø · {machine.pinSpacingMm}mm {isFr ? 'entraxe' : 'spacing'}
        </p>

        <div className="flex items-center justify-between">
          <p style={{ fontSize: '16px', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>
            {product.priceCad.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 })}
          </p>
          <span style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', fontWeight: 300 }}>
            {isFr ? 'Voir' : 'View'} <ArrowRight size={11} />
          </span>
        </div>
      </Link>

      {/* Quote shortcut */}
      <Link
        to={`/contact?${quoteParams}`}
        onClick={onProductClick}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 22px', borderTop: '1px solid #2a2a2a', backgroundColor: 'rgba(255,197,0,0.06)', color: '#FFC500', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background-color 0.15s' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,197,0,0.12)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,197,0,0.06)')}
      >
        <Tag size={11} />
        {isFr ? `Devis pour ${brandShort} ${machine.model}` : `Get Quote — ${brandShort} ${machine.model}`}
      </Link>
    </div>
  );
}

// ─── Tonnage matrix (fallback browse view) ────────────────────────────────────
const TONNAGE_BANDS = [
  { label: '1–5T',   labelFr: '1–5T',   min: 1,  max: 5,  desc: 'Mini excavators',          descFr: 'Mini-excavateurs'    },
  { label: '5–12T',  labelFr: '5–12T',  min: 5,  max: 12, desc: 'Compact excavators',       descFr: 'Excavateurs compacts'},
  { label: '12–25T', labelFr: '12–25T', min: 12, max: 25, desc: 'Mid-class excavators',     descFr: 'Excavateurs mi-class'},
  { label: '25–50T', labelFr: '25–50T', min: 25, max: 50, desc: 'Large class excavators',   descFr: 'Grands excavateurs'  },
];

function TonnageMatrix({ isFr }: { isFr: boolean }) {
  const [activeBand, setActiveBand] = useState<typeof TONNAGE_BANDS[0] | null>(null);

  const bandProducts = useMemo(() => {
    if (!activeBand) return [];
    return products.filter(
      (p) => p.tonnageRange[0] <= activeBand.max && p.tonnageRange[1] >= activeBand.min,
    );
  }, [activeBand]);

  const brandColumns = brandData.map((b) => ({
    ...b,
    models: b.models.filter(
      (m) => activeBand && m.tonnage >= activeBand.min && m.tonnage <= activeBand.max,
    ),
  })).filter((b) => b.models.length > 0);

  return (
    <div>
      {/* Band tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {TONNAGE_BANDS.map((band) => {
          const active = activeBand?.label === band.label;
          return (
            <button
              key={band.label}
              onClick={() => setActiveBand(active ? null : band)}
              style={{ padding: '10px 20px', backgroundColor: active ? '#FFC500' : '#1a1a1a', border: `1px solid ${active ? '#FFC500' : '#2a2a2a'}`, color: active ? '#111' : 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: active ? 700 : 300, letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {isFr ? band.labelFr : band.label}
              <span style={{ marginLeft: '6px', fontSize: '10px', opacity: 0.7 }}>
                {isFr ? band.descFr : band.desc}
              </span>
            </button>
          );
        })}
      </div>

      {activeBand && (
        <div>
          {/* Compatible products row */}
          <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
            {isFr ? 'Accessoires compatibles' : 'Compatible attachments'}
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {bandProducts.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: '#1a1a1a', border: '1px solid #2e2e2e', color: '#fff', fontSize: '12px', textDecoration: 'none', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#FFC500')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#2e2e2e')}
              >
                <CheckCircle2 size={11} color="#FFC500" />
                {isFr ? p.nameFr : p.name}
              </Link>
            ))}
          </div>

          {/* OEM model list */}
          <p style={{ fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontWeight: 300, marginBottom: '14px' }}>
            {isFr ? 'Modèles OEM compatibles dans cette classe' : 'Compatible OEM models in this class'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {brandColumns.map((b) => (
              <div key={b.brand} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', padding: '16px 18px' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: b.color, flexShrink: 0 }} />
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>{b.shortName}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  {b.models.map((m) => (
                    <div key={m.model} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 300 }}>{m.model}</span>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>{m.armPinDiamMm}mm Ø</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!activeBand && (
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}>
          {isFr ? 'Sélectionnez une classe de tonnage pour voir les modèles compatibles.' : 'Select a tonnage class above to see compatible models.'}
        </p>
      )}
    </div>
  );
}
