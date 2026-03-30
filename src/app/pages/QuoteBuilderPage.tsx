import { useState, useMemo, useEffect } from 'react';
import { products } from '../data/products';

// ─── Types ───────────────────────────────────────────────────────────────────
interface QuoteItem {
  productId: string;
  qty: number;
  factoryCny: number;
}
type Lang = 'en' | 'zh';
type TooltipKey = keyof typeof TT;

// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_CNY_RATE   = 0.19;
const DEFAULT_USD_RATE   = 1.38;
const DEFAULT_CONTAINER  = 3100;   // USD per 20GP Qingdao→Toronto
const DEFAULT_UNITS      = 5;      // units per container (user adjusts)
const DEFAULT_DUTY       = 0.5;    // HS 8431.49.00.99 — actual B3 duty ≈$56.90/shipment (near-FREE MFN)
const DEFAULT_BROKER     = 50;     // CAD per unit, incl. EMF
const DEFAULT_MARGIN     = 35;

// ─── Bilingual Labels ─────────────────────────────────────────────────────────
const L = {
  en: {
    internalTool:       'Internal Tool',
    title:              'Quote Builder',
    subtitle:           'Calculate landed cost → selling price → copy to QuickBooks Estimate',
    live:               'LIVE',
    manual:             'MANUAL',
    fetching:           'Fetching rates…',
    fetchError:         'Rate fetch failed — using manual values',
    refreshRates:       '↻ Refresh Rates',
    costParams:         'Cost Parameters',
    cnyRate:            'CNY → CAD Rate',
    dutyPct:            'Import Duty %',
    broker:             'Broker / Unit (CAD)',
    margin:             'Margin %',
    containerSection:   'Container Freight Calculator',
    freightUsd:         'Container Freight (USD)',
    usdRate:            'USD → CAD Rate',
    unitsInCont:        'Units in Container',
    freightUnit:        'Freight / Unit (CAD)',
    autoCalc:           'auto-calculated',
    customerLabel:      'Customer Name (for quote summary)',
    customerPlaceholder:'e.g. Acme Excavation Ltd.',
    lineItems:          'Line Items',
    product:            'Product',
    qty:                'Qty',
    factoryCny:         'Factory Cost (CNY/unit)',
    factoryCad:         'Factory (CAD)',
    landedUnit:         'Landed / Unit',
    sellUnit:           'Suggested Retail',
    totalRev:           'Total Revenue',
    totalProfit:        'Total Profit',
    removeLine:         'Remove line',
    addLine:            '+ Add product line',
    totalLanded:        'Total Landed Cost',
    totalQuote:         'Total Quote Value',
    totalProfitLabel:   'Total Profit',
    copyBtn:            'Copy Quote → QuickBooks',
    copied:             '✓ Copied!',
    footer:             'Internal tool — not indexed or linked from public navigation',
  },
  zh: {
    internalTool:       '内部工具',
    title:              '报价单工具',
    subtitle:           '计算到岸成本 → 建议零售价 → 复制到 QuickBooks',
    live:               '实时',
    manual:             '手动',
    fetching:           '正在获取汇率…',
    fetchError:         '汇率获取失败 — 使用手动数值',
    refreshRates:       '↻ 刷新汇率',
    costParams:         '成本参数',
    cnyRate:            '人民币 → 加元 汇率',
    dutyPct:            '进口关税 %',
    broker:             '报关费 / 件 (CAD)',
    margin:             '毛利率 %',
    containerSection:   '货柜运费计算器',
    freightUsd:         '货柜运费 (USD)',
    usdRate:            '美元 → 加元 汇率',
    unitsInCont:        '本柜装箱件数',
    freightUnit:        '单件运费 (CAD)',
    autoCalc:           '自动计算',
    customerLabel:      '客户名称（用于报价摘要）',
    customerPlaceholder:'例：Acme Excavation Ltd.',
    lineItems:          '产品明细',
    product:            '产品',
    qty:                '数量',
    factoryCny:         '出厂价（人民币/件）',
    factoryCad:         '工厂成本 (CAD)',
    landedUnit:         '到岸成本/件',
    sellUnit:           '建议零售价',
    totalRev:           '总报价',
    totalProfit:        '总利润',
    removeLine:         '删除此行',
    addLine:            '+ 添加产品行',
    totalLanded:        '总到岸成本',
    totalQuote:         '总报价金额',
    totalProfitLabel:   '总利润',
    copyBtn:            '复制报价单 → QuickBooks',
    copied:             '✓ 已复制！',
    footer:             '内部工具 — 不在公开导航中显示',
  },
} as const;

// ─── Tooltip Content ──────────────────────────────────────────────────────────
const TT = {
  cnyRate: {
    en: 'CNY → CAD exchange rate. Auto-fetched from Frankfurter API on load. Override manually if needed.',
    zh: '人民币对加元汇率，页面加载时自动从 Frankfurter API 获取，可手动覆盖。',
  },
  dutyPct: {
    en: 'Canadian import duty. HS 8431.49.00.99 (excavator attachments) — MFN rate from China is effectively FREE (~0%). Last B3 showed only $56.90 customs duty on full shipment. Verify with broker each time.',
    zh: '加拿大进口关税。HS 8431.49.00.99（挖掘机附件）— 中国 MFN 税率实际接近免税。上批 B3 全柜关税仅 $56.90，占比约 0.5%。建议每批次向报关行核实。',
  },
  broker: {
    en: 'Customs broker fee per unit (includes EMF and other port surcharges, amortized per piece).',
    zh: '每件分摊的报关行费用，含 EMF 等港口附加费，按件均摊。',
  },
  margin: {
    en: 'Gross margin %. Retail = Landed ÷ (1 − margin%). E.g. 35% on $1,000 landed → $1,538 retail.',
    zh: '毛利率 %。零售价 = 到岸成本 ÷ (1 − 毛利率)。例：到岸 $1,000，毛利 35% → 零售 $1,538。',
  },
  freightUsd: {
    en: '20GP full container sea freight, Qingdao Port → Toronto Brampton CN Inland Port. ~USD 3,100 / ~40 days via Vancouver.',
    zh: '20尺整柜海运费，青岛港 → 多伦多 Brampton CN 内陆港，约 USD 3,100，经温哥华中转，航程约40天。',
  },
  usdRate: {
    en: 'USD → CAD exchange rate for converting container freight cost. Auto-fetched.',
    zh: '美元对加元汇率，用于折算货柜运费，自动获取。',
  },
  unitsInCont: {
    en: 'Number of units loaded in this shipment. Freight/unit = (Container USD × USD/CAD) ÷ units.',
    zh: '本次货柜实际装箱件数。单件运费 = (货柜USD × 美元汇率) ÷ 件数。',
  },
} satisfies Record<string, { en: string; zh: string }>;

// ─── Tooltip Component ────────────────────────────────────────────────────────
function Tooltip({ id, lang }: { id: TooltipKey; lang: Lang }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1 align-middle">
      <button
        type="button"
        aria-label="info"
        className="w-[14px] h-[14px] rounded-full border border-zinc-600 hover:border-yellow-400 text-zinc-500 hover:text-yellow-400 text-[9px] font-bold leading-none transition-colors flex items-center justify-center shrink-0"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(v => !v)}
      >
        ?
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-64 bg-zinc-800 border border-zinc-600 rounded-lg p-3 text-xs text-zinc-300 shadow-2xl pointer-events-none leading-relaxed">
          {TT[id][lang]}
          <span className="absolute top-full left-3 border-4 border-transparent border-t-zinc-600" />
        </div>
      )}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function QuoteBuilderPage() {
  const [lang, setLang] = useState<Lang>('en');
  const t = L[lang];

  const [items, setItems] = useState<QuoteItem[]>([
    { productId: products[0].id, qty: 1, factoryCny: 0 },
  ]);

  // CNY→CAD exchange rate (auto-fetched)
  const [rate, setRate]           = useState(DEFAULT_CNY_RATE);
  // USD→CAD exchange rate (auto-fetched, for container freight)
  const [usdCadRate, setUsdCadRate] = useState(DEFAULT_USD_RATE);
  const [rateLive, setRateLive]   = useState(false);
  const [rateFetching, setRateFetching] = useState(false);
  const [rateError, setRateError] = useState(false);

  // Container freight inputs
  const [freightContainerUSD, setFreightContainerUSD] = useState(DEFAULT_CONTAINER);
  const [unitsInContainer, setUnitsInContainer]       = useState(DEFAULT_UNITS);

  // Cost parameters
  const [dutyPct, setDutyPct]         = useState(DEFAULT_DUTY);
  const [brokerPerUnit, setBrokerPerUnit] = useState(DEFAULT_BROKER);
  const [marginPct, setMarginPct]     = useState(DEFAULT_MARGIN);

  const [customerName, setCustomerName] = useState('');
  const [copied, setCopied]           = useState(false);

  // Freight per unit is derived — never stored in state
  const freightPerUnit = unitsInContainer > 0
    ? (freightContainerUSD * usdCadRate) / unitsInContainer
    : 0;

  // Auto-fetch both rates from Frankfurter API (free, no key required)
  async function fetchRates() {
    setRateFetching(true);
    setRateError(false);
    try {
      const [cnyRes, usdRes] = await Promise.all([
        fetch('https://api.frankfurter.app/latest?from=CNY&to=CAD'),
        fetch('https://api.frankfurter.app/latest?from=USD&to=CAD'),
      ]);
      const [cnyData, usdData] = await Promise.all([cnyRes.json(), usdRes.json()]);
      setRate(Number(cnyData.rates.CAD.toFixed(4)));
      setUsdCadRate(Number(usdData.rates.CAD.toFixed(4)));
      setRateLive(true);
    } catch {
      // API unavailable — keep current values, show error
      setRateError(true);
      setRateLive(false);
    } finally {
      setRateFetching(false);
    }
  }

  // Fetch on mount
  useEffect(() => { fetchRates(); }, []);

  const rows = useMemo(() => {
    return items.map(item => {
      const product    = products.find(p => p.id === item.productId)!;
      const factoryCad = item.factoryCny * rate;
      const dutyAmt    = factoryCad * (dutyPct / 100);
      // Landed cost = factory + duty + sea freight share + broker/EMF
      const landedUnit  = factoryCad + dutyAmt + freightPerUnit + brokerPerUnit;
      // Selling price derived from margin: price = cost / (1 - margin%)
      const sellingUnit = landedUnit / (1 - marginPct / 100);
      const totalLanded  = landedUnit  * item.qty;
      const totalSelling = sellingUnit * item.qty;
      const totalProfit  = totalSelling - totalLanded;
      return { product, ...item, factoryCad, landedUnit, sellingUnit, totalLanded, totalSelling, totalProfit };
    });
  }, [items, rate, freightPerUnit, dutyPct, brokerPerUnit, marginPct]);

  const totals = useMemo(() => ({
    landed:  rows.reduce((s, r) => s + r.totalLanded,  0),
    selling: rows.reduce((s, r) => s + r.totalSelling, 0),
    profit:  rows.reduce((s, r) => s + r.totalProfit,  0),
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
      `Lead Time: 6–10 weeks | FOB Qingdao`,
      `Valid: 14 days | info@borealironheavy.ca`,
    ].filter(Boolean).join('\n');
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const inputCls  = 'w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400';
  const sectionCls = 'bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6';
  const sectionTitle = 'text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider';
  const labelCls  = 'text-xs text-zinc-400 mb-1 flex items-center gap-0';

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* ── Header + Language Toggle ── */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-yellow-400 font-mono tracking-widest uppercase mb-1">{t.internalTool}</p>
            <h1 className="text-2xl font-bold text-white">{t.title}</h1>
            <p className="text-zinc-400 text-sm mt-1">{t.subtitle}</p>
          </div>
          {/* Page-level bilingual toggle (EN / 中文) */}
          <div className="flex items-center mt-1 shrink-0 rounded-md overflow-hidden border border-zinc-700">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === 'en' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >EN</button>
            <button
              onClick={() => setLang('zh')}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${lang === 'zh' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >中文</button>
          </div>
        </div>

        {/* ── Live Rate Status Bar ── */}
        <div className="flex items-center gap-3 mb-6 text-xs flex-wrap">
          <span className={`px-2 py-0.5 rounded font-mono font-bold ${rateLive ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
            {rateLive ? `● ${t.live}` : `○ ${t.manual}`}
          </span>
          {rateFetching
            ? <span className="text-zinc-500 animate-pulse">{t.fetching}</span>
            : rateError
              ? <span className="text-red-400">{t.fetchError}</span>
              : rateLive
                ? <span className="text-zinc-500">CNY/CAD: <span className="text-zinc-300 font-mono">{rate}</span> · USD/CAD: <span className="text-zinc-300 font-mono">{usdCadRate}</span></span>
                : null
          }
          <button
            onClick={fetchRates}
            disabled={rateFetching}
            className="ml-auto px-3 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-zinc-400 hover:text-white transition-colors disabled:opacity-40 whitespace-nowrap"
          >{t.refreshRates}</button>
        </div>

        {/* ── Cost Parameters ── */}
        <div className={sectionCls}>
          <h2 className={sectionTitle}>{t.costParams}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>
                {t.cnyRate}<Tooltip id="cnyRate" lang={lang} />
              </label>
              <input type="number" step="0.0001" value={rate}
                onChange={e => { setRate(Number(e.target.value)); setRateLive(false); }}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>
                {t.dutyPct}<Tooltip id="dutyPct" lang={lang} />
              </label>
              <input type="number" step="0.1" value={dutyPct}
                onChange={e => setDutyPct(Number(e.target.value))}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>
                {t.broker}<Tooltip id="broker" lang={lang} />
              </label>
              <input type="number" value={brokerPerUnit}
                onChange={e => setBrokerPerUnit(Number(e.target.value))}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>
                {t.margin}<Tooltip id="margin" lang={lang} />
              </label>
              <input type="number" value={marginPct}
                onChange={e => setMarginPct(Number(e.target.value))}
                className={inputCls} />
            </div>
          </div>
        </div>

        {/* ── Container Freight Calculator ── */}
        <div className={sectionCls}>
          <h2 className={sectionTitle}>{t.containerSection}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className={labelCls}>
                {t.freightUsd}<Tooltip id="freightUsd" lang={lang} />
              </label>
              <input type="number" value={freightContainerUSD}
                onChange={e => setFreightContainerUSD(Number(e.target.value))}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>
                {t.usdRate}<Tooltip id="usdRate" lang={lang} />
              </label>
              <input type="number" step="0.0001" value={usdCadRate}
                onChange={e => { setUsdCadRate(Number(e.target.value)); setRateLive(false); }}
                className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>
                {t.unitsInCont}<Tooltip id="unitsInCont" lang={lang} />
              </label>
              <input type="number" min="1" value={unitsInContainer}
                onChange={e => setUnitsInContainer(Number(e.target.value))}
                className={inputCls} />
            </div>
            {/* Read-only: auto-calculated freight per unit */}
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">{t.freightUnit}</label>
              <div className="w-full bg-zinc-800/40 border border-dashed border-zinc-600 rounded px-3 py-2 text-sm flex items-center gap-2">
                <span className="text-yellow-400 font-semibold">{fmt(freightPerUnit)}</span>
                <span className="text-zinc-600 text-xs">({t.autoCalc})</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Customer ── */}
        <div className={sectionCls}>
          <label className="text-xs text-zinc-400 mb-1 block">{t.customerLabel}</label>
          <input type="text" placeholder={t.customerPlaceholder} value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className={inputCls + ' max-w-xs'} />
        </div>

        {/* ── Line Items ── */}
        <div className={sectionCls}>
          <h2 className={sectionTitle}>{t.lineItems}</h2>
          <div className="space-y-4">
            {rows.map((row, idx) => (
              <div key={idx} className="bg-zinc-800/60 border border-zinc-700 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-zinc-400 mb-1 block">{t.product}</label>
                    <select value={row.productId}
                      onChange={e => updateItem(idx, 'productId', e.target.value)}
                      className={inputCls}>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.tonnageLabel})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">{t.qty}</label>
                    <input type="number" min="1" value={row.qty}
                      onChange={e => updateItem(idx, 'qty', e.target.value)}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">{t.factoryCny}</label>
                    <input type="number" placeholder="e.g. 12000" value={row.factoryCny || ''}
                      onChange={e => updateItem(idx, 'factoryCny', e.target.value)}
                      className={inputCls} />
                  </div>
                </div>

                {/* Cost breakdown — only shown once factory cost is entered */}
                {row.factoryCny > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {([
                      { label: t.factoryCad, value: fmt(row.factoryCad),   color: 'text-zinc-300',  highlight: false },
                      { label: t.landedUnit,  value: fmt(row.landedUnit),   color: 'text-blue-400',  highlight: false },
                      { label: t.sellUnit,    value: fmt(row.sellingUnit),  color: 'text-yellow-300 text-base font-bold', highlight: true },
                      { label: t.totalRev,    value: fmt(row.totalSelling), color: 'text-green-400', highlight: false },
                      { label: t.totalProfit, value: fmt(row.totalProfit),  color: 'text-emerald-400', highlight: false },
                    ] as const).map(cell => (
                      <div key={cell.label} className={`bg-zinc-900 rounded p-2 ${cell.highlight ? 'border border-yellow-400/40 ring-1 ring-yellow-400/10' : ''}`}>
                        <p className="text-zinc-500 mb-1">{cell.label}</p>
                        <p className={`font-semibold ${cell.color}`}>{cell.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {items.length > 1 && (
                  <button onClick={() => removeItem(idx)}
                    className="mt-3 text-xs text-zinc-500 hover:text-red-400 transition-colors">
                    {t.removeLine}
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addItem}
            className="mt-4 text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
            {t.addLine}
          </button>
        </div>

        {/* ── Totals + Copy ── */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-zinc-500 mb-1">{t.totalLanded}</p>
              <p className="text-lg font-bold text-blue-400">{fmt(totals.landed)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">{t.totalQuote}</p>
              <p className="text-xl font-bold text-yellow-400">{fmt(totals.selling)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">{t.totalProfitLabel}</p>
              <p className="text-lg font-bold text-emerald-400">{fmt(totals.profit)}</p>
            </div>
          </div>
          <button onClick={copyQuote}
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-sm rounded-lg transition-colors whitespace-nowrap">
            {copied ? t.copied : t.copyBtn}
          </button>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">{t.footer}</p>
      </div>
    </div>
  );
}
