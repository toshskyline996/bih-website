import { useEffect, useState } from 'react';
import { QRCodeLabel, type LabelUnit } from '../components/QRCodeLabel';

interface Sku {
  id: string;
  name: string;
  model?: string;
  category?: string;
}

const CARD: React.CSSProperties = {
  background: '#1c1c1c',
  border: '1px solid #2a2a2a',
  borderRadius: 12,
  padding: 20,
};

const INPUT: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#242424',
  border: '1px solid #3a3a3a',
  borderRadius: 8,
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#a8a8a8',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export function InventoryInboundPage({ apiKey }: { apiKey: string }) {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loadingSkus, setLoadingSkus] = useState(true);

  const [skuId, setSkuId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('main');
  const [costCad, setCostCad] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [generatedUnits, setGeneratedUnits] = useState<LabelUnit[]>([]);

  // New SKU form
  const [showNewSku, setShowNewSku] = useState(false);
  const [newSkuName, setNewSkuName] = useState('');
  const [newSkuModel, setNewSkuModel] = useState('');
  const [newSkuCategory, setNewSkuCategory] = useState('');
  const [savingSkuMsg, setSavingSkuMsg] = useState('');

  const authHeader = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };

  async function loadSkus() {
    setLoadingSkus(true);
    try {
      const res = await fetch('/api/inventory/sku', { headers: { Authorization: `Bearer ${apiKey}` } });
      if (res.ok) setSkus((await res.json()).skus ?? []);
    } finally {
      setLoadingSkus(false);
    }
  }

  useEffect(() => { loadSkus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreateSku() {
    if (!newSkuName.trim()) return;
    setSavingSkuMsg('Saving…');
    try {
      const res = await fetch('/api/inventory/sku', {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({ name: newSkuName.trim(), model: newSkuModel.trim() || undefined, category: newSkuCategory.trim() || undefined }),
      });
      if (!res.ok) throw new Error('Failed to create SKU');
      const { id } = await res.json();
      await loadSkus();
      setSkuId(id);
      setNewSkuName(''); setNewSkuModel(''); setNewSkuCategory('');
      setShowNewSku(false);
      setSavingSkuMsg('');
    } catch {
      setSavingSkuMsg('Error saving SKU');
    }
  }

  async function handleInbound() {
    if (!skuId) { setError('Please select a SKU'); return; }
    setSubmitting(true);
    setError('');
    setGeneratedUnits([]);
    try {
      const res = await fetch('/api/inventory/inbound', {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({
          sku_id: skuId,
          quantity,
          location: location || 'main',
          cost_cad: costCad ? parseFloat(costCad) : undefined,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Inbound failed');
      }
      const data = await res.json();
      const sku = skus.find(s => s.id === skuId);
      const units: LabelUnit[] = (data.units ?? []).map((u: { id: string; label_id: string }) => ({
        id: u.id,
        label_id: u.label_id,
        sku_name: sku?.name ?? '',
        sku_model: sku?.model,
      }));
      setGeneratedUnits(units);
      setQuantity(1);
      setCostCad('');
      setNotes('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Inbound failed');
    } finally {
      setSubmitting(false);
    }
  }

  const selectedSku = skus.find(s => s.id === skuId);

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* SKU Selection */}
        <div style={CARD}>
          <h2 style={{ fontSize: 16, color: '#fff', marginBottom: 16 }}>① Select Product (SKU)</h2>

          {loadingSkus ? (
            <div style={{ color: '#6b6b6b', fontSize: 13 }}>Loading SKUs…</div>
          ) : (
            <select
              value={skuId}
              onChange={e => setSkuId(e.target.value)}
              style={{ ...INPUT, marginBottom: 12 }}
            >
              <option value="">— Select a SKU —</option>
              {skus.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.model ? ` (${s.model})` : ''}
                </option>
              ))}
            </select>
          )}

          {selectedSku && (
            <div style={{ background: 'rgba(255,209,0,0.06)', border: '1px solid rgba(255,209,0,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#FFD100' }}>
              {selectedSku.name}{selectedSku.model ? ` · ${selectedSku.model}` : ''}{selectedSku.category ? ` · ${selectedSku.category}` : ''}
            </div>
          )}

          <button
            onClick={() => setShowNewSku(v => !v)}
            style={{ marginTop: 12, background: 'transparent', border: '1px dashed #3a3a3a', borderRadius: 8, color: '#a8a8a8', padding: '8px 16px', cursor: 'pointer', fontSize: 13, width: '100%' }}
          >
            {showNewSku ? '— Cancel new SKU' : '+ Create new SKU'}
          </button>

          {showNewSku && (
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={LABEL_STYLE}>Product Name *</label>
                <input value={newSkuName} onChange={e => setNewSkuName(e.target.value)} placeholder="e.g. 液压破碎锤" style={INPUT} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Model</label>
                <input value={newSkuModel} onChange={e => setNewSkuModel(e.target.value)} placeholder="e.g. HB-308" style={INPUT} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Category</label>
                <input value={newSkuCategory} onChange={e => setNewSkuCategory(e.target.value)} placeholder="e.g. breaker" style={INPUT} />
              </div>
              <button
                onClick={handleCreateSku}
                style={{ background: '#FFD100', color: '#000', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
              >
                Save SKU
              </button>
              {savingSkuMsg && <div style={{ fontSize: 13, color: '#a8a8a8' }}>{savingSkuMsg}</div>}
            </div>
          )}
        </div>

        {/* Inbound Details */}
        <div style={CARD}>
          <h2 style={{ fontSize: 16, color: '#fff', marginBottom: 16 }}>② Inbound Details</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={LABEL_STYLE}>Quantity *</label>
              <input
                type="number" min={1} max={200}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
                style={INPUT}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>Location</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="main" style={INPUT} />
            </div>
            <div>
              <label style={LABEL_STYLE}>Cost per Unit (CAD)</label>
              <input
                type="number" min={0} step="0.01"
                value={costCad}
                onChange={e => setCostCad(e.target.value)}
                placeholder="0.00"
                style={INPUT}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>Notes</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" style={INPUT} />
            </div>

            {error && <div style={{ color: '#FF6B6B', fontSize: 13 }}>{error}</div>}

            <button
              onClick={handleInbound}
              disabled={submitting || !skuId}
              style={{
                background: submitting || !skuId ? '#2a2a2a' : '#FFD100',
                color: submitting || !skuId ? '#6b6b6b' : '#000',
                border: 'none', borderRadius: 8,
                padding: '12px',
                fontWeight: 700, fontSize: 15,
                cursor: submitting || !skuId ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Registering…' : `Register ${quantity} Unit${quantity > 1 ? 's' : ''} →`}
            </button>
          </div>
        </div>
      </div>

      {/* Label Preview & Print */}
      {generatedUnits.length > 0 && (
        <div style={CARD}>
          <h2 style={{ fontSize: 16, color: '#fff', marginBottom: 4 }}>③ Labels Ready</h2>
          <p style={{ fontSize: 13, color: '#a8a8a8', marginBottom: 20 }}>
            {generatedUnits.length} unit{generatedUnits.length > 1 ? 's' : ''} registered. Print labels and attach to physical items.
          </p>
          <QRCodeLabel units={generatedUnits} />
        </div>
      )}
    </div>
  );
}
