import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, ChevronLeft, Truck, ShieldCheck, AlertCircle } from 'lucide-react';
import {
  useCartStore,
  selectSubtotal,
  selectTotalWeight,
} from '../store/cartStore';
import { getTaxInfo, PROVINCE_OPTIONS } from '../utils/canadianTax';

// 初始化 Stripe — publishable key 在 Cloudflare 环境变量中设置
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');

// ─── Types ────────────────────────────────────────────────────────────────────
interface ShippingInfo {
  firstName: string; lastName: string;
  email: string;     phone: string;
  company: string;   street: string;
  city: string;      province: string;
  postal: string;
}

interface ShippingRate {
  service: string;
  transitDays: number;
  priceCad: number;
  source: 'manitoulin' | 'estimate';
}

const EMPTY_SHIPPING: ShippingInfo = {
  firstName: '', lastName: '', email: '', phone: '',
  company: '', street: '', city: '', province: 'ON', postal: '',
};

const fmt = (n: number) =>
  n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });

// ─── Main CheckoutPage ────────────────────────────────────────────────────────
export function CheckoutPage() {
  const items        = useCartStore((s) => s.items);
  const subtotal     = useCartStore(selectSubtotal);
  const totalWeight  = useCartStore(selectTotalWeight);
  const navigate     = useNavigate();

  const [step, setStep]               = useState<1 | 2>(1);
  const [shipping, setShipping]       = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [rates, setRates]             = useState<ShippingRate[]>([]);
  const [selectedRate, setSelected]   = useState<ShippingRate | null>(null);
  const [clientSecret, setSecret]     = useState<string | null>(null);
  const [orderMeta, setOrderMeta]     = useState<object | null>(null);
  const [fetching, setFetching]       = useState(false);
  const [error, setError]             = useState('');

  const taxInfo   = getTaxInfo(shipping.province);
  const taxAmount = selectedRate
    ? Math.round((subtotal + selectedRate.priceCad) * taxInfo.rate * 100) / 100
    : 0;

  // ── Step 1: 获取运费报价 ────────────────────────────────────────────────
  const handleGetRates = useCallback(async () => {
    setFetching(true);
    setError('');
    try {
      const res = await fetch('/api/shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          destinationProvince: shipping.province,
          destinationPostal: shipping.postal,
        }),
      });
      const data = await res.json() as { rates: ShippingRate[] };
      setRates(data.rates ?? []);
      if (data.rates?.length) setSelected(data.rates[0]);
    } catch {
      setError('Failed to fetch shipping rates. Please try again.');
    } finally {
      setFetching(false);
    }
  }, [items, shipping.province, shipping.postal]);

  // ── Step 1 → Step 2: 初始化 Stripe PaymentIntent ─────────────────────
  const handleContinueToPayment = useCallback(async () => {
    if (!selectedRate) return;
    setFetching(true);
    setError('');
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          shippingCad: selectedRate.priceCad,
          province: shipping.province,
          customerEmail: shipping.email,
          customerName: `${shipping.firstName} ${shipping.lastName}`.trim(),
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(errBody.error ?? 'Payment initialization failed');
      }
      const data = await res.json() as {
        clientSecret: string;
        subtotal: number; taxAmount: number; taxName: string;
        shipping: number; total: number;
      };
      setSecret(data.clientSecret);
      // 在 sessionStorage 暂存订单元数据供 OrderSuccessPage 读取
      const meta = {
        customer: {
          name:    `${shipping.firstName} ${shipping.lastName}`.trim(),
          email:   shipping.email,
          phone:   shipping.phone,
          company: shipping.company,
        },
        items: items.map((i) => ({ productId: i.productId, name: i.name, qty: i.qty, priceCad: i.priceCad })),
        subtotal:  data.subtotal,
        taxAmount: data.taxAmount,
        taxName:   data.taxName,
        shipping:  data.shipping,
        total:     data.total,
        shippingAddress: {
          street:   shipping.street,
          city:     shipping.city,
          province: shipping.province,
          postal:   shipping.postal,
        },
        totalWeightKg: totalWeight,
      };
      sessionStorage.setItem('bih-order-meta', JSON.stringify(meta));
      setOrderMeta(meta);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment initialization failed');
    } finally {
      setFetching(false);
    }
  }, [items, selectedRate, shipping, totalWeight]);

  const isStep1Valid = !!(
    shipping.firstName && shipping.lastName && shipping.email &&
    shipping.street && shipping.city && shipping.province && shipping.postal
  );

  // 表单填完且邮编 >= 5 位时自动获取运费，省去手动点击
  useEffect(() => {
    const cleanPostal = shipping.postal.replace(/\s/g, '');
    if (cleanPostal.length >= 5 && isStep1Valid && rates.length === 0 && !fetching && items.length > 0) {
      handleGetRates();
    }
    // 仅由邮编或省份变更触发；handleGetRates via useCallback 稳定故省略
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipping.postal, shipping.province]);

  // 购物车为空时跳转 — 必须在所有 Hooks 之后
  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true });
  }, [items.length, navigate]);

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── 步骤指示器 ── */}
        <div className="flex items-center gap-4 mb-10">
          <StepBadge n={1} active={step === 1} done={step === 2} label="Shipping" />
          <div className="flex-1 h-px bg-[#222]" />
          <StepBadge n={2} active={step === 2} done={false} label="Payment" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── 主内容区 ── */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <ShippingStep
                shipping={shipping}
                setShipping={setShipping}
                rates={rates}
                selectedRate={selectedRate}
                setSelected={setSelected}
                onGetRates={handleGetRates}
                onContinue={handleContinueToPayment}
                fetching={fetching}
                error={error}
                isValid={!!isStep1Valid}
              />
            )}
            {step === 2 && clientSecret && orderMeta && (
              <>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Shipping
                </button>
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: { theme: 'night', labels: 'floating' } }}
                >
                  <PaymentStep orderMeta={orderMeta as OrderMeta} />
                </Elements>
              </>
            )}
          </div>

          {/* ── 订单摘要侧栏 ── */}
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={selectedRate?.priceCad ?? null}
            taxAmount={selectedRate ? taxAmount : null}
            taxName={taxInfo.taxName}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Shipping Form ────────────────────────────────────────────────────
function ShippingStep({
  shipping, setShipping,
  rates, selectedRate, setSelected,
  onGetRates, onContinue,
  fetching, error, isValid,
}: {
  shipping: ShippingInfo;
  setShipping: (s: ShippingInfo) => void;
  rates: ShippingRate[];
  selectedRate: ShippingRate | null;
  setSelected: (r: ShippingRate) => void;
  onGetRates: () => void;
  onContinue: () => void;
  fetching: boolean; error: string; isValid: boolean;
}) {
  const set = (k: keyof ShippingInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setShipping({ ...shipping, [k]: e.target.value });

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6">
      <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
        <Truck className="w-5 h-5 text-[#FFC500]" /> Shipping Information
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label="First Name *" value={shipping.firstName} onChange={set('firstName')} />
        <Field label="Last Name *"  value={shipping.lastName}  onChange={set('lastName')} />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label="Email *" type="email" value={shipping.email} onChange={set('email')} />
        <Field label="Phone"   type="tel"   value={shipping.phone} onChange={set('phone')} />
      </div>
      <Field label="Company (optional)" value={shipping.company} onChange={set('company')} className="mb-4" />
      <Field label="Street Address *" value={shipping.street} onChange={set('street')} className="mb-4" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field label="City *" value={shipping.city} onChange={set('city')} />
        <div>
          <label className="block text-gray-400 text-sm mb-1">Province *</label>
          <select
            value={shipping.province}
            onChange={set('province')}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white focus:border-[#FFC500] focus:outline-none text-sm"
          >
            {PROVINCE_OPTIONS.map((p) => (
              <option key={p.code} value={p.code}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>
      <Field label="Postal Code *" value={shipping.postal} onChange={set('postal')} className="mb-6" placeholder="e.g. L1H 4L3" />

      {/* 运费报价按钮 */}
      {!rates.length && (
        <button
          onClick={onGetRates}
          disabled={!isValid || fetching}
          className="w-full py-3 border border-[#FFC500] text-[#FFC500] font-semibold rounded-lg hover:bg-[#FFC500]/10 transition disabled:opacity-40 disabled:cursor-not-allowed mb-4 flex items-center justify-center gap-2"
        >
          {fetching ? <><Loader2 className="w-4 h-4 animate-spin" /> Getting rates…</> : 'Get Shipping Quote'}
        </button>
      )}

      {/* 运费选项 */}
      {rates.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-3">Select shipping option:</p>
          {rates.map((r) => (
            <label
              key={r.service}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer mb-2 transition ${
                selectedRate?.service === r.service
                  ? 'border-[#FFC500] bg-[#FFC500]/5'
                  : 'border-[#333] hover:border-[#555]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shipping-rate"
                  checked={selectedRate?.service === r.service}
                  onChange={() => setSelected(r)}
                  className="accent-[#FFC500]"
                />
                <div>
                  <p className="text-white text-sm font-medium">{r.service}</p>
                  <p className="text-gray-500 text-xs">{r.transitDays} business days{r.source === 'estimate' ? ' · estimate' : ''}</p>
                </div>
              </div>
              <span className="text-[#FFC500] font-bold">
                {r.priceCad.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
              </span>
            </label>
          ))}
          <button
            onClick={onGetRates}
            className="text-xs text-gray-500 hover:text-gray-300 transition mt-1"
          >
            ↻ Recalculate
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <button
        onClick={onContinue}
        disabled={!selectedRate || fetching}
        className="w-full py-3 bg-[#FFC500] text-[#003366] font-bold rounded-lg hover:bg-yellow-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {fetching ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : 'Continue to Payment →'}
      </button>
    </div>
  );
}

// ─── Step 2: Stripe Payment Form ──────────────────────────────────────────────
interface OrderMeta {
  customer: { name: string; email: string; phone: string; company: string };
  items: { productId: string; name: string; qty: number; priceCad: number }[];
  subtotal: number; taxAmount: number; taxName: string;
  shipping: number; total: number;
  shippingAddress: { street: string; city: string; province: string; postal: string };
  totalWeightKg: number;
}

function PaymentStep({ orderMeta }: { orderMeta: OrderMeta }) {
  const stripe   = useStripe();
  const elements = useElements();
  const navigate  = useNavigate();
  const clearCart = useCartStore((s) => s.clearCart);

  const [paying, setPaying]   = useState(false);
  const [error, setError]     = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setError('');

    const { error: stripeErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (stripeErr) {
      setError(stripeErr.message ?? 'Payment failed');
      setPaying(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      // 在后台同步 QBO（失败不阻断跳转）
      try {
        await fetch('/api/qbo-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stripePaymentIntentId: paymentIntent.id,
            ...orderMeta,
          }),
        });
      } catch { /* QBO 失败静默处理，订单已在 Stripe 记录 */ }

      clearCart();
      navigate(`/order/success?pi=${paymentIntent.id}`, { replace: true });
    }
    setPaying(false);
  };

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6">
      <h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-[#FFC500]" /> Secure Payment
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Your order will be under review before fulfillment. We'll contact you within 1–2 business days.
      </p>

      <form onSubmit={handlePay}>
        <PaymentElement className="mb-6" />

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={paying || !stripe}
          className="w-full py-4 bg-[#FFC500] text-[#003366] font-bold rounded-lg hover:bg-yellow-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {paying
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing Payment…</>
            : `Pay ${orderMeta.total.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })} CAD`}
        </button>
      </form>
    </div>
  );
}

// ─── Shared: Order Summary Sidebar ───────────────────────────────────────────
function OrderSummary({
  items, subtotal, shipping, taxAmount, taxName,
}: {
  items: { productId: string; name: string; qty: number; priceCad: number }[];
  subtotal: number;
  shipping: number | null;
  taxAmount: number | null;
  taxName: string;
}) {
  const total = subtotal + (shipping ?? 0) + (taxAmount ?? 0);
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-5 h-fit sticky top-24">
      <h3 className="text-white font-bold mb-4">Your Order</h3>
      {items.map((i) => (
        <div key={i.productId} className="flex justify-between text-sm mb-2">
          <span className="text-gray-400 truncate max-w-[160px]">{i.name} × {i.qty}</span>
          <span className="text-white ml-2 shrink-0">
            {(i.priceCad * i.qty).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })}
          </span>
        </div>
      ))}
      <div className="border-t border-[#222] my-3" />
      <Row label="Subtotal" value={fmt(subtotal)} />
      <Row
        label={`${taxName}`}
        value={taxAmount !== null ? fmt(taxAmount) : '—'}
        sub
      />
      <Row
        label="Shipping"
        value={shipping !== null ? fmt(shipping) : '—'}
        sub
      />
      <div className="border-t border-[#222] my-3" />
      <div className="flex justify-between text-white font-bold">
        <span>Total</span>
        <span className="text-[#FFC500]">{fmt(total)}</span>
      </div>
      <p className="text-xs text-gray-600 mt-4 text-center">
        🔒 Powered by Stripe · All prices in CAD
      </p>
    </div>
  );
}

// ─── Utility sub-components ───────────────────────────────────────────────────
function StepBadge({ n, active, done, label }: { n: number; active: boolean; done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
          done   ? 'bg-green-500 text-white'  :
          active ? 'bg-[#FFC500] text-[#003366]' :
                   'bg-[#222] text-gray-500'
        }`}
      >
        {done ? '✓' : n}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
}

function Field({
  label, value, onChange, type = 'text', className = '', placeholder,
}: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; className?: string; placeholder?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-gray-400 text-sm mb-1">{label}</label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:border-[#FFC500] focus:outline-none text-sm"
      />
    </div>
  );
}

function Row({ label, value, sub }: { label: string; value: string; sub?: boolean }) {
  return (
    <div className="flex justify-between text-sm mb-1.5">
      <span className={sub ? 'text-gray-500' : 'text-gray-400'}>{label}</span>
      <span className={sub ? 'text-gray-400' : 'text-white'}>{value}</span>
    </div>
  );
}
