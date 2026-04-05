import { useState } from 'react';
import { InventoryStockPage } from './InventoryStockPage';
import { InventoryInboundPage } from './InventoryInboundPage';
import { InventoryScanPage } from './InventoryScanPage';

const STORAGE_KEY = 'bih_inventory_key';
type Tab = 'stock' | 'inbound' | 'scan';

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onAuth }: { onAuth: (key: string) => void }) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/inventory/ping', {
        headers: { Authorization: `Bearer ${key.trim()}` },
      });
      if (res.ok) {
        sessionStorage.setItem(STORAGE_KEY, key.trim());
        onAuth(key.trim());
      } else {
        setError('Invalid key — access denied');
      }
    } catch {
      setError('Network error — could not reach server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#141414',
    }}>
      <div style={{
        background: '#1c1c1c',
        border: '1px solid #2a2a2a',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 400,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>Inventory Admin</h1>
          <p style={{ fontSize: 13, color: '#6b6b6b', marginTop: 6 }}>Enter your admin key to access</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            type="password"
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="Admin secret key"
            autoFocus
            style={{
              padding: '12px 16px',
              background: '#242424',
              border: '1px solid #3a3a3a',
              borderRadius: 8,
              color: '#fff',
              fontSize: 15,
              outline: 'none',
            }}
          />
          {error && (
            <div style={{
              background: 'rgba(255,107,107,0.10)',
              border: '1px solid #FF6B6B',
              borderRadius: 8,
              padding: '10px 14px',
              color: '#FF6B6B',
              fontSize: 13,
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#2a2a2a' : '#FFD100',
              color: loading ? '#6b6b6b' : '#000',
              border: 'none',
              borderRadius: 8,
              padding: '13px',
              fontWeight: 700,
              fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Verifying…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard Shell ───────────────────────────────────────────────────────────
function Dashboard({ apiKey }: { apiKey: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('stock');

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'stock',   label: '库存看板',   emoji: '📊' },
    { id: 'inbound', label: '入库登记',   emoji: '📥' },
    { id: 'scan',    label: '扫码出库',   emoji: '📷' },
  ];

  return (
    <div style={{ background: '#141414', minHeight: 'calc(100vh - 80px)', paddingBottom: 40 }}>
      {/* Page Header */}
      <div style={{
        background: '#1c1c1c',
        borderBottom: '1px solid #2a2a2a',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>📦 Inventory Management</h1>
          <p style={{ fontSize: 12, color: '#6b6b6b', margin: '4px 0 0' }}>Boreal Iron Heavy — Internal</p>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem(STORAGE_KEY);
            window.location.reload();
          }}
          style={{
            padding: '8px 16px',
            background: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: '#1c1c1c', borderBottom: '1px solid #2a2a2a', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 20px',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === tab.id ? '3px solid #FFD100' : '3px solid transparent',
                color: activeTab === tab.id ? '#FFD100' : '#a8a8a8',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 700 : 400,
                cursor: 'pointer',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        {activeTab === 'stock'   && <InventoryStockPage   apiKey={apiKey} />}
        {activeTab === 'inbound' && <InventoryInboundPage apiKey={apiKey} />}
        {activeTab === 'scan'    && <InventoryScanPage    apiKey={apiKey} />}
      </div>
    </div>
  );
}

// ── Exported Page ─────────────────────────────────────────────────────────────
export function InventoryPage() {
  const [apiKey, setApiKey] = useState<string | null>(
    () => sessionStorage.getItem(STORAGE_KEY)
  );

  if (!apiKey) return <LoginScreen onAuth={setApiKey} />;
  return <Dashboard apiKey={apiKey} />;
}
