import { useState, useEffect, useCallback } from 'react';

const API = 'https://bih-intel-api.yxj19980410.workers.dev';
const STORAGE_KEY = 'bih_intel_key';

// ── Types ─────────────────────────────────────────────────────────
interface Summary {
  tender:  { total: number; new: number };
  rba:     { total: number; needs_review: number; avg_price_cad: number | null };
  freight: { latest: FreightRow | null };
  compat:  { searches_7d: number };
}
interface TenderRow  { id: number; listing_id: string; title: string; region: string; est_value_cad: number | null; deadline: string | null; status: string; source_url: string | null; created_at: string }
interface RbaRow     { id: number; listing_id: string; title: string; category: string | null; brand: string | null; price_cad: number; sale_date: string; url: string | null; needs_review: number }
interface FreightRow { id: number; date: string; scfi_na_west: number | null; scfi_na_east: number | null; scfi_europe: number | null; wow_change_pct: number | null; ma4w: number | null; est_ff_quote: number | null }
interface CompatRow  { id: number; ts: string; event: string; brand: string | null; model: string | null; tonnage: number | null; product_name: string | null }

// ── Helpers ───────────────────────────────────────────────────────
const fmt = (n: number | null | undefined, currency = true) =>
  n == null ? '—' : currency
    ? new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
    : n.toFixed(1);

const badge = (s: string) => {
  const colors: Record<string, string> = {
    new: 'bg-yellow-500/20 text-yellow-400',
    reviewed: 'bg-blue-500/20 text-blue-400',
    actioned: 'bg-green-500/20 text-green-400',
    dismissed: 'bg-zinc-500/20 text-zinc-400',
  };
  return colors[s] ?? 'bg-zinc-500/20 text-zinc-400';
};

// ── Login screen ──────────────────────────────────────────────────
function LoginScreen({ onAuth }: { onAuth: (key: string) => void }) {
  const [val, setVal] = useState('');
  const [err, setErr] = useState('');

  const attempt = async () => {
    setErr('');
    const res = await fetch(`${API}/query/summary`, { headers: { Authorization: `Bearer ${val}` } });
    if (res.ok) { sessionStorage.setItem(STORAGE_KEY, val); onAuth(val); }
    else setErr('Invalid key — try again');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
        <p className="text-yellow-400 text-xs tracking-widest uppercase mb-1">Boreal Iron Heavy</p>
        <h1 className="text-white text-2xl font-black mb-6">Intel Dashboard</h1>
        <input
          type="password"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="API key"
          className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-yellow-500 mb-3"
        />
        {err && <p className="text-red-400 text-xs mb-3">{err}</p>}
        <button onClick={attempt} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg text-sm transition">
          Authenticate
        </button>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${accent ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-black ${accent ? 'text-yellow-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-zinc-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────
function SectionHead({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-white font-bold text-lg">{title}</h2>
      {count != null && <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{count}</span>}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────
function Dashboard({ apiKey }: { apiKey: string }) {
  const [summary,  setSummary]  = useState<Summary | null>(null);
  const [tenders,  setTenders]  = useState<TenderRow[]>([]);
  const [rba,      setRba]      = useState<RbaRow[]>([]);
  const [freight,  setFreight]  = useState<FreightRow[]>([]);
  const [compat,   setCompat]   = useState<CompatRow[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState<'tender' | 'rba' | 'freight' | 'compat'>('tender');

  const headers = { Authorization: `Bearer ${apiKey}` };

  const load = useCallback(async () => {
    setLoading(true);
    const [s, t, r, f, c] = await Promise.all([
      fetch(`${API}/query/summary`,         { headers }).then(x => x.json()),
      fetch(`${API}/query/tender?limit=20`, { headers }).then(x => x.json()),
      fetch(`${API}/query/rba?limit=20`,    { headers }).then(x => x.json()),
      fetch(`${API}/query/freight?limit=12`,{ headers }).then(x => x.json()),
      fetch(`${API}/query/compat?days=30&limit=100`, { headers }).then(x => x.json()),
    ]);
    setSummary(s);
    setTenders(t.data ?? []);
    setRba(r.data ?? []);
    setFreight(f.data ?? []);
    setCompat(c.data ?? []);
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  useEffect(() => { load(); }, [load]);

  // compat stats
  const compatStats = compat.reduce((acc, r) => {
    acc[r.event] = (acc[r.event] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topBrands = Object.entries(
    compat.filter(r => r.event === 'model_selected' && r.brand)
      .reduce((a, r) => { a[r.brand!] = (a[r.brand!] ?? 0) + 1; return a; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const noResults = [...new Set(
    compat.filter(r => r.event === 'no_results').map(r => `${r.brand} ${r.model}`)
  )].slice(0, 8);

  const tabs: { key: typeof tab; label: string }[] = [
    { key: 'tender',  label: '📋 Tenders' },
    { key: 'rba',     label: '🏷 RBA Listings' },
    { key: 'freight', label: '🚢 Freight Rates' },
    { key: 'compat',  label: '🔍 Compat Analytics' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-yellow-400 text-xs tracking-widest uppercase">Boreal Iron Heavy</p>
          <h1 className="text-xl font-black">Intelligence Dashboard</h1>
        </div>
        <button onClick={load} disabled={loading}
          className="text-xs bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition disabled:opacity-50">
          {loading ? 'Loading…' : '↺ Refresh'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Tenders — New" value={summary?.tender.new ?? '…'} sub={`${summary?.tender.total ?? 0} total`} accent />
          <StatCard label="RBA Listings" value={summary?.rba.total ?? '…'} sub={`${summary?.rba.needs_review ?? 0} need review`} />
          <StatCard label="NA West Rate" value={summary?.freight.latest?.scfi_na_west ? fmt(summary.freight.latest.scfi_na_west) : '—'} sub={summary?.freight.latest?.date ?? 'No data'} />
          <StatCard label="Compat (7d)" value={summary?.compat.searches_7d ?? '…'} sub="model searches" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${tab === t.key ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tenders tab ── */}
        {tab === 'tender' && (
          <div>
            <SectionHead title="GTA Tender Alerts" count={tenders.length} />
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Region</th>
                    <th className="px-4 py-3 text-right">Est. Value</th>
                    <th className="px-4 py-3 text-left">Deadline</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {tenders.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-600">No tenders yet</td></tr>
                  )}
                  {tenders.map(r => (
                    <tr key={r.id} className="hover:bg-zinc-900/50 transition">
                      <td className="px-4 py-3 max-w-xs">
                        {r.source_url
                          ? <a href={r.source_url} target="_blank" rel="noreferrer" className="text-yellow-400 hover:underline line-clamp-2">{r.title}</a>
                          : <span className="text-zinc-300 line-clamp-2">{r.title}</span>}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{r.region}</td>
                      <td className="px-4 py-3 text-right text-zinc-300">{fmt(r.est_value_cad)}</td>
                      <td className="px-4 py-3 text-zinc-400">{r.deadline ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${badge(r.status)}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RBA tab ── */}
        {tab === 'rba' && (
          <div>
            <SectionHead title="RBA Auction Listings" count={rba.length} />
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Brand</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Price (CAD)</th>
                    <th className="px-4 py-3 text-left">Sale Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {rba.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-600">No listings yet</td></tr>
                  )}
                  {rba.map(r => (
                    <tr key={r.id} className="hover:bg-zinc-900/50 transition">
                      <td className="px-4 py-3 max-w-xs">
                        {r.url
                          ? <a href={r.url} target="_blank" rel="noreferrer" className="text-yellow-400 hover:underline line-clamp-2">{r.title}</a>
                          : <span className="text-zinc-300 line-clamp-2">{r.title}</span>}
                        {r.needs_review === 1 && <span className="ml-2 text-xs text-orange-400">⚠ review</span>}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{r.brand ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-400">{r.category ?? '—'}</td>
                      <td className="px-4 py-3 text-right font-mono text-green-400">{fmt(r.price_cad)}</td>
                      <td className="px-4 py-3 text-zinc-400">{r.sale_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Freight tab ── */}
        {tab === 'freight' && (
          <div>
            <SectionHead title="Weekly Freight Rates" count={freight.length} />
            {/* Mini bar chart for NA West */}
            {freight.length > 0 && (() => {
              const reversed = [...freight].reverse();
              const maxVal = Math.max(...reversed.map(r => r.scfi_na_west ?? 0));
              return (
                <div className="mb-6 bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                  <p className="text-zinc-500 text-xs mb-3">NA West Coast (China→Vancouver) — Last {reversed.length} weeks</p>
                  <div className="flex items-end gap-1 h-24">
                    {reversed.map(r => (
                      <div key={r.id} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-yellow-500 rounded-sm"
                          style={{ height: r.scfi_na_west ? `${(r.scfi_na_west / maxVal) * 88}px` : '2px' }} />
                        <span className="text-zinc-600 text-[9px] rotate-45 origin-left truncate">{r.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900 text-zinc-500 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-right">NA West</th>
                    <th className="px-4 py-3 text-right">NA East</th>
                    <th className="px-4 py-3 text-right">Europe</th>
                    <th className="px-4 py-3 text-right">WoW %</th>
                    <th className="px-4 py-3 text-right">Est FF Quote</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {freight.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-zinc-600">No freight data yet — submit your first rate via the WF7 form</td></tr>
                  )}
                  {freight.map(r => (
                    <tr key={r.id} className="hover:bg-zinc-900/50 transition">
                      <td className="px-4 py-3 text-zinc-300 font-mono">{r.date}</td>
                      <td className="px-4 py-3 text-right font-mono text-white">{fmt(r.scfi_na_west)}</td>
                      <td className="px-4 py-3 text-right font-mono text-zinc-400">{fmt(r.scfi_na_east)}</td>
                      <td className="px-4 py-3 text-right font-mono text-zinc-400">{fmt(r.scfi_europe)}</td>
                      <td className={`px-4 py-3 text-right font-mono ${r.wow_change_pct == null ? 'text-zinc-600' : r.wow_change_pct > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {r.wow_change_pct == null ? '—' : `${r.wow_change_pct > 0 ? '+' : ''}${r.wow_change_pct}%`}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-yellow-400">{fmt(r.est_ff_quote)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Compat tab ── */}
        {tab === 'compat' && (
          <div className="space-y-6">
            <SectionHead title="Compatibility Finder — Last 30 Days" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['model_selected', 'product_clicked', 'no_results', 'brand_selected'].map(ev => (
                <div key={ev} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                  <p className="text-zinc-500 text-xs mb-1">{ev.replace('_', ' ')}</p>
                  <p className="text-white text-2xl font-black">{compatStats[ev] ?? 0}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top brands */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                <p className="text-zinc-400 text-sm font-semibold mb-3">Top Brands Searched</p>
                {topBrands.length === 0
                  ? <p className="text-zinc-600 text-sm">No data</p>
                  : topBrands.map(([brand, n]) => {
                    const max = topBrands[0][1];
                    return (
                      <div key={brand} className="flex items-center gap-3 mb-2">
                        <span className="text-zinc-300 text-sm w-24 truncate">{brand}</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(n / max) * 100}%` }} />
                        </div>
                        <span className="text-zinc-500 text-xs w-6 text-right">{n}</span>
                      </div>
                    );
                  })}
              </div>
              {/* No results */}
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
                <p className="text-zinc-400 text-sm font-semibold mb-3">⚠ No-Match Models (Catalog Gaps)</p>
                {noResults.length === 0
                  ? <p className="text-zinc-600 text-sm">None — all searches returned results</p>
                  : noResults.map(m => (
                    <div key={m} className="flex items-center gap-2 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                      <span className="text-zinc-300 text-sm">{m}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page entry ────────────────────────────────────────────────────
export function IntelDashboardPage() {
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem(STORAGE_KEY));

  if (!apiKey) return <LoginScreen onAuth={setApiKey} />;
  return <Dashboard apiKey={apiKey} />;
}
