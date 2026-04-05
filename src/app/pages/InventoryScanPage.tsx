import { useState, useCallback } from 'react';
import { QRScanner } from '../components/QRScanner';

type ScanState = 'scanning' | 'confirming' | 'done' | 'error';

interface UnitInfo {
  id: string;
  label_id: string;
  sku_name: string;
  sku_model?: string;
  status: string;
  location: string;
}

const CARD: React.CSSProperties = {
  background: '#1c1c1c',
  border: '1px solid #2a2a2a',
  borderRadius: 12,
  padding: 20,
};

export function InventoryScanPage({ apiKey }: { apiKey: string }) {
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [unit, setUnit] = useState<UnitInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [processing, setProcessing] = useState(false);
  const [lastSold, setLastSold] = useState<UnitInfo | null>(null);

  const authHeader = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };

  const handleScan = useCallback(async (decoded: string) => {
    if (scanState !== 'scanning') return;
    setScanState('confirming');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/inventory/unit/${decoded}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Unit not found');
      }
      const data = await res.json();
      setUnit(data.unit);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Lookup failed');
      setScanState('error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanState, apiKey]);

  async function confirmScanOut() {
    if (!unit) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/inventory/scan-out', {
        method: 'POST',
        headers: authHeader,
        body: JSON.stringify({ unit_id: unit.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Scan-out failed');
      }
      setLastSold(unit);
      setScanState('done');
      setUnit(null);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Scan-out failed');
      setScanState('error');
    } finally {
      setProcessing(false);
    }
  }

  function reset() {
    setScanState('scanning');
    setUnit(null);
    setErrorMsg('');
  }

  const STATUS_COLORS: Record<string, string> = {
    in_stock: '#FFD100',
    reserved: '#FFA500',
    sold:     '#A0A0A0',
    damaged:  '#FF6B6B',
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 60px' }}>

      {/* Scanner — active only when in scanning state */}
      {scanState === 'scanning' && (
        <div style={{ ...CARD, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, color: '#fff', marginBottom: 4 }}>📷 Scan Unit QR Code</h2>
          <p style={{ fontSize: 13, color: '#a8a8a8', marginBottom: 16 }}>
            Point camera at a BIH unit label to look up and scan out.
          </p>
          <QRScanner onScan={handleScan} active={scanState === 'scanning'} />
        </div>
      )}

      {/* Last sold confirmation */}
      {lastSold && scanState !== 'confirming' && (
        <div style={{
          background: 'rgba(255,209,0,0.08)',
          border: '1px solid rgba(255,209,0,0.3)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#FFD100', fontWeight: 600 }}>✓ Scanned Out</div>
            <div style={{ fontSize: 14, color: '#fff', marginTop: 2 }}>
              {lastSold.label_id} — {lastSold.sku_name}
            </div>
          </div>
        </div>
      )}

      {/* Confirming state */}
      {scanState === 'confirming' && unit && (
        <div style={CARD}>
          <h2 style={{ fontSize: 16, color: '#fff', marginBottom: 16 }}>Confirm Scan-Out</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#6b6b6b' }}>Label ID</span>
              <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#FFD100', fontWeight: 700 }}>{unit.label_id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#6b6b6b' }}>Product</span>
              <span style={{ fontSize: 14, color: '#fff' }}>{unit.sku_name}</span>
            </div>
            {unit.sku_model && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#6b6b6b' }}>Model</span>
                <span style={{ fontSize: 14, color: '#a8a8a8' }}>{unit.sku_model}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#6b6b6b' }}>Location</span>
              <span style={{ fontSize: 14, color: '#a8a8a8' }}>{unit.location}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#6b6b6b' }}>Status</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: STATUS_COLORS[unit.status] ?? '#fff' }}>
                {unit.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {unit.status !== 'in_stock' && unit.status !== 'reserved' && (
            <div style={{ background: 'rgba(255,107,107,0.10)', border: '1px solid #FF6B6B', borderRadius: 8, padding: '10px 14px', color: '#FF6B6B', fontSize: 13, marginBottom: 16 }}>
              ⚠ This unit is already <strong>{unit.status}</strong> — cannot scan out.
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={reset}
              style={{ flex: 1, padding: '12px', background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: 8, color: '#a8a8a8', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              onClick={confirmScanOut}
              disabled={processing || (unit.status !== 'in_stock' && unit.status !== 'reserved')}
              style={{
                flex: 2, padding: '12px',
                background: processing ? '#2a2a2a' : '#FFD100',
                border: 'none', borderRadius: 8,
                color: processing ? '#6b6b6b' : '#000',
                fontSize: 15, fontWeight: 700, cursor: processing ? 'not-allowed' : 'pointer',
              }}
            >
              {processing ? 'Processing…' : '✓ Confirm Scan-Out'}
            </button>
          </div>
        </div>
      )}

      {/* Done state */}
      {scanState === 'done' && (
        <div style={{ ...CARD, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#FFD100', marginBottom: 8 }}>Scan-Out Complete</div>
          <div style={{ fontSize: 14, color: '#a8a8a8', marginBottom: 24 }}>
            {lastSold?.label_id} has been marked as sold.
          </div>
          <button
            onClick={reset}
            style={{ background: '#FFD100', color: '#000', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
          >
            Scan Next Unit
          </button>
        </div>
      )}

      {/* Error state */}
      {scanState === 'error' && (
        <div style={CARD}>
          <div style={{ color: '#FF6B6B', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>⚠ Error</div>
            <div style={{ fontSize: 14 }}>{errorMsg}</div>
          </div>
          <button
            onClick={reset}
            style={{ background: '#FFD100', color: '#000', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
