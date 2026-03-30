import { useState, useMemo } from 'react';
import { products } from '../data/products';

interface QuoteItem {
  productId: string;
  qty: number;
  factoryCny: number;
}

const DEFAULT_RATE = 0.19;
const DEFAULT_DUTY = 6.5;
const DEFAULT_FREIGHT = 120;
const DEFAULT_BROKER = 50;
const DEFAULT_MARGIN = 35;

export function QuoteBuilderPage() {
  const [items, setItems] = useState<QuoteItem[]>([
    { productId: products[0].id, qty: 1, factoryCny: 0 },
  ]);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const [freightPerUnit, setFreightPerUnit] = useState(DEFAULT_FREIGHT);
  const [dutyPct, setDutyPct] = useState(DEFAULT_DUTY);
  const [brokerPerUnit, setBrokerPerUnit] = useState(DEFAULT_BROKER);
  const [marginPct, setMarginPct] = useState(DEFAULT_MARGIN);
  const [customerName, setCustomerName] = useState('');
  const [copied, setCopied] = useState(false);

  const rows = useMemo(() => {
    return items.map(item => {
      const product = products.find(p => p.id === item.productId)!;
      const factoryCad = item.factoryCny * rate;
      const dutyAmt = factoryCad * (dutyPct / 100);
      const landedUnit = factoryCad + dutyAmt + freightPerUnit + brokerPerUnit;
      const sellingUnit = landedUnit / (1 - marginPct / 100);
      const totalLanded = landedUnit * item.qty;
      const totalSelling = sellingUnit * item.qty;
      const totalProfit = totalSelling - totalLanded;
      return {
        product,
        ...item,
        factoryCad,
        landedUnit,
        sellingUnit,
        totalLanded,
        totalSelling,
        totalProfit,
      };
    });
  }, [items, rate, freightPerUnit, dutyPct, brokerPerUnit, marginPct]);

  const totals = useMemo(() => ({
    landed: rows.reduce((s, r) => s + r.totalLanded, 0),
    selling: rows.reduce((s, r) => s + r.totalSelling, 0),
    profit: rows.reduce((s, r) => s + r.totalProfit, 0),
  }), [rows]);

  function addItem() {
    setItems(prev => [...prev, { productId: products[0].id, qty: 1, factoryCny: 0 }]);
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof QuoteItem, value: string | number) {
    setItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, [field]: field === 'productId' ? value : Number(value) } : item
    ));
  }

  function fmt(n: number) {
    return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
  }

  function copyQuote() {
    const date = new Date().toLocaleDateString('en-CA');
    const lines = [
      `QUOTE SUMMARY — BIH | Boreal Iron Heavy`,
      `Date: ${date}`,
      customerName ? `Customer: ${customerName}` : '',
      ``,
      `────────────────────────────────`,
      ...rows.map(r =>
        `${r.product.name} (${r.product.tonnageLabel})\n  Qty: ${r.qty} × ${fmt(r.sellingUnit)} = ${fmt(r.totalSelling)}`
      ),
      `────────────────────────────────`,
      `TOTAL: ${fmt(totals.selling)}`,
      ``,
      `Lead Time: 3–4 weeks | FOB Oshawa, ON`,
      `Valid: 14 days | info@borealironheavy.ca`,
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const labelCls = 'text-xs text-zinc-400 mb-1 block';
  const inputCls = 'w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400';

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-yellow-400 font-mono tracking-widest uppercase mb-1">Internal Tool</p>
          <h1 className="text-2xl font-bold text-white">Quote Builder</h1>
          <p className="text-zinc-400 text-sm mt-1">Calculate landed cost → selling price → copy to QuickBooks Estimate</p>
        </div>

        {/* Global Parameters */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">Cost Parameters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <label className={labelCls}>CNY → CAD Rate</label>
              <input type="number" step="0.001" value={rate} onChange={e => setRate(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Freight / Unit (CAD)</label>
              <input type="number" value={freightPerUnit} onChange={e => setFreightPerUnit(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Import Duty %</label>
              <input type="number" step="0.1" value={dutyPct} onChange={e => setDutyPct(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Broker / Unit (CAD)</label>
              <input type="number" value={brokerPerUnit} onChange={e => setBrokerPerUnit(Number(e.target.value))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Margin %</label>
              <input type="number" value={marginPct} onChange={e => setMarginPct(Number(e.target.value))} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <label className={labelCls}>Customer Name (for quote summary)</label>
          <input
            type="text"
            placeholder="e.g. Acme Excavation Ltd."
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className={inputCls + ' max-w-xs'}
          />
        </div>

        {/* Line Items */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">Line Items</h2>

          <div className="space-y-4">
            {rows.map((row, idx) => (
              <div key={idx} className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Product</label>
                    <select
                      value={row.productId}
                      onChange={e => updateItem(idx, 'productId', e.target.value)}
                      className={inputCls}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.tonnageLabel})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={e => updateItem(idx, 'qty', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Factory Cost (CNY/unit)</label>
                    <input
                      type="number"
                      placeholder="e.g. 12000"
                      value={row.factoryCny || ''}
                      onChange={e => updateItem(idx, 'factoryCny', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Calculated breakdown */}
                {row.factoryCny > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {[
                      { label: 'Factory (CAD)', value: fmt(row.factoryCad), color: 'text-zinc-300' },
                      { label: 'Landed / Unit', value: fmt(row.landedUnit), color: 'text-blue-400' },
                      { label: 'Sell Price / Unit', value: fmt(row.sellingUnit), color: 'text-yellow-400' },
                      { label: 'Total Revenue', value: fmt(row.totalSelling), color: 'text-green-400' },
                      { label: 'Total Profit', value: fmt(row.totalProfit), color: 'text-emerald-400' },
                    ].map(cell => (
                      <div key={cell.label} className="bg-zinc-900 rounded p-2">
                        <p className="text-zinc-500 mb-1">{cell.label}</p>
                        <p className={`font-semibold ${cell.color}`}>{cell.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(idx)}
                    className="mt-3 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Remove line
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="mt-4 text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            + Add product line
          </button>
        </div>

        {/* Totals + Actions */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Total Landed Cost</p>
              <p className="text-lg font-bold text-blue-400">{fmt(totals.landed)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Total Quote Value</p>
              <p className="text-lg font-bold text-yellow-400">{fmt(totals.selling)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Total Profit</p>
              <p className="text-lg font-bold text-emerald-400">{fmt(totals.profit)}</p>
            </div>
          </div>

          <button
            onClick={copyQuote}
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm rounded-lg transition-colors whitespace-nowrap"
          >
            {copied ? '✓ Copied!' : 'Copy Quote → QuickBooks'}
          </button>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Internal tool — not indexed or linked from public navigation
        </p>
      </div>
    </div>
  );
}
