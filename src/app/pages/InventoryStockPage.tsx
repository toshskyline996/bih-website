import { useEffect, useState } from 'react';

interface Sku {
  id: string;
  name: string;
  model?: string;
  category?: string;
  unit_count: number;
  in_stock_count: number;
}

interface Unit {
  id: string;
  label_id: string;
  sku_id: string;
  sku_name: string;
  sku_model?: string;
  status: string;
  location: string;
  cost_cad?: number;
  arrived_at: number;
  sold_at?: number;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  in_stock: { bg: 'rgba(255,209,0,0.10)', color: '#FFD100' },
  reserved: { bg: 'rgba(255,165,0,0.10)', color: '#FFA500' },
  sold:     { bg: 'rgba(160,160,160,0.10)', color: '#A0A0A0' },
  damaged:  { bg: 'rgba(255,107,107,0.10)', color: '#FF6B6B' },
};

const CARD: React.CSSProperties = {
  background: '#1c1c1c',
  border: '1px solid #2a2a2a',
  borderRadius: 12,
  padding: 20,
};

export function InventoryStockPage({ apiKey }: { apiKey: string }) {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('in_stock');
  const [selectedSku, setSelectedSku] = useState('');

  const authHeader = { Authorization: `Bearer ${apiKey}` };

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [skuRes, unitRes] = await Promise.all([
        fetch('/api/inventory/sku', { headers: authHeader }),
        fetch(`/api/inventory/units?status=${statusFilter}&sku_id=${selectedSku}&limit=200`, { headers: authHeader }),
      ]);
      if (!skuRes.ok || !unitRes.ok) throw new Error('API error');
      const [skuData, unitData] = await Promise.all([skuRes.json(), unitRes.json()]);
      setSkus(skuData.skus ?? []);
      setUnits(unitData.units ?? []);
    } catch {
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [statusFilter, selectedSku]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalInStock = skus.reduce((s, k) => s + k.in_stock_count, 0);
  const totalUnits   = skus.reduce((s, k) => s + k.unit_count, 0);

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'SKU Types', value: skus.length },
          { label: 'In Stock', value: totalInStock },
          { label: 'Total Units', value: totalUnits },
          { label: 'Sold', value: totalUnits - totalInStock },
        ].map(c => (
          <div key={c.label} style={{ ...CARD, borderLeft: '4px solid #FFD100' }}>
            <div style={{ fontSize: 12, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* SKU Overview */}
      <div style={{ ...CARD, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, color: '#fff', marginBottom: 16 }}>SKU Overview</h2>
        {skus.length === 0 && !loading ? (
          <p style={{ color: '#6b6b6b', fontSize: 14 }}>No SKUs yet — go to Inbound to add products.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
            {skus.map(sku => (
              <div
                key={sku.id}
                onClick={() => setSelectedSku(prev => prev === sku.id ? '' : sku.id)}
                style={{
                  background: selectedSku === sku.id ? '#2a2a2a' : '#141414',
                  border: `1px solid ${selectedSku === sku.id ? '#FFD100' : '#2a2a2a'}`,
                  borderRadius: 8,
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{sku.name}</div>
                {sku.model && <div style={{ fontSize: 12, color: '#a8a8a8', marginTop: 2 }}>{sku.model}</div>}
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <span style={{ ...STATUS_COLORS.in_stock, padding: '2px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: STATUS_COLORS.in_stock.bg, color: STATUS_COLORS.in_stock.color }}>
                    {sku.in_stock_count} in stock
                  </span>
                  <span style={{ fontSize: 12, color: '#6b6b6b' }}>{sku.unit_count} total</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Units Table */}
      <div style={CARD}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 16, color: '#fff', margin: 0 }}>
            Units {selectedSku ? `— ${skus.find(s => s.id === selectedSku)?.name}` : '(All SKUs)'}
          </h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['in_stock', 'reserved', 'sold', 'damaged', ''].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderColor: statusFilter === s ? '#FFD100' : '#3a3a3a',
                  background: statusFilter === s ? 'rgba(255,209,0,0.12)' : '#1c1c1c',
                  color: statusFilter === s ? '#FFD100' : '#a8a8a8',
                }}
              >
                {s === '' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
            <button onClick={load} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #3a3a3a', background: '#1c1c1c', color: '#a8a8a8', fontSize: 12, cursor: 'pointer' }}>
              ↻ Refresh
            </button>
          </div>
        </div>

        {error && <div style={{ color: '#FF6B6B', marginBottom: 12, fontSize: 14 }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b6b6b' }}>Loading…</div>
        ) : units.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b6b6b', fontSize: 14 }}>
            No units match the current filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Label ID', 'SKU', 'Status', 'Location', 'Cost (CAD)', 'Arrived'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #2a2a2a', fontSize: 11, color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#0d0d0d', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {units.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: 14, color: '#FFD100', fontWeight: 600 }}>{u.label_id}</td>
                    <td style={{ padding: '12px', fontSize: 13, color: '#fff' }}>
                      {u.sku_name}
                      {u.sku_model && <span style={{ color: '#6b6b6b', marginLeft: 6 }}>{u.sku_model}</span>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ ...STATUS_COLORS[u.status] ?? STATUS_COLORS.in_stock, background: (STATUS_COLORS[u.status] ?? STATUS_COLORS.in_stock).bg, padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                        {u.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: 13, color: '#a8a8a8' }}>{u.location}</td>
                    <td style={{ padding: '12px', fontSize: 13, color: '#a8a8a8' }}>{u.cost_cad ? `$${u.cost_cad.toFixed(2)}` : '—'}</td>
                    <td style={{ padding: '12px', fontSize: 12, color: '#6b6b6b' }}>
                      {new Date(u.arrived_at * 1000).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
