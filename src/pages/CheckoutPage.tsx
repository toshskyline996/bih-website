/**
 * CheckoutPage — NeoBrutalism 双列结账页
 * 左列：收货信息 + 运费选择
 * 右列：订单摘要（sticky）+ Stripe 支付
 * 设计语言：与 CartPage 保持一致，4px 粗边框 + 硬阴影
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, Truck, ShieldCheck, Package, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { PROVINCE_TAX_RATES } from '@/utils/canadianTax';

// Stripe 公钥从环境变量读取（前端安全）
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

/* ─────────────────────────────────────────
   步骤 1: 收货信息表单
───────────────────────────────────────── */
interface ShippingInfo {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

function ShippingForm({
  onNext,
}: {
  onNext: (info: ShippingInfo, shippingCad: number) => void;
}) {
  const { items, totalWeightKg } = useCartStore();
  const [form, setForm] = useState<ShippingInfo>({
    firstName: '', lastName: '', company: '',
    email: '', phone: '', address: '',
    city: '', province: 'ON', postalCode: '',
  });
  const [shippingRates, setShippingRates] = useState<Array<{ service: string; priceCad: number; etaDays: string; carrier: string }>>([]);
  const [selectedRate, setSelectedRate] = useState<number | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesError, setRatesError] = useState('');

  // 省份变动或邮编完整时自动获取运费（fetchRates 定义在下方，eslint disable 合理）
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (form.postalCode.length >= 6 && form.province) {
      fetchRates();
    }
  }, [form.province, form.postalCode]);

  async function fetchRates() {
    setLoadingRates(true);
    setRatesError('');
    try {
      const res = await fetch('/.netlify/functions/shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weightKg: totalWeightKg(), provinceCode: form.province }),
      });
      const data = await res.json();
      setShippingRates(data.rates || []);
      if (data.rates?.length > 0) setSelectedRate(data.rates[0].priceCad);
    } catch {
      setRatesError('Unable to fetch shipping rates. Please try again.');
    } finally {
      setLoadingRates(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedRate === null && shippingRates.length > 0) {
      setRatesError('Please select a shipping method.');
      return;
    }
    onNext(form, selectedRate || 0);
  }

  if (items.length === 0) return null;

  const nbInput = 'w-full bg-white border-4 border-bih-navy px-4 py-3 text-bih-navy placeholder-bih-gray-400 font-medium focus:outline-none focus:ring-4 focus:ring-bih-yellow/50';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-black uppercase text-bih-navy border-b-4 border-bih-navy pb-3">
        Shipping Information
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <input name="firstName" placeholder="First Name *" required value={form.firstName} onChange={handleChange} className={nbInput} />
        <input name="lastName" placeholder="Last Name *" required value={form.lastName} onChange={handleChange} className={nbInput} />
      </div>

      <input name="company" placeholder="Company Name" value={form.company} onChange={handleChange} className={nbInput} />

      <div className="grid sm:grid-cols-2 gap-4">
        <input name="email" type="email" placeholder="Email Address *" required value={form.email} onChange={handleChange} className={nbInput} />
        <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} className={nbInput} />
      </div>

      <input name="address" placeholder="Street Address *" required value={form.address} onChange={handleChange} className={nbInput} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <input name="city" placeholder="City *" required value={form.city} onChange={handleChange} className={nbInput} />
        <select name="province" required value={form.province} onChange={handleChange}
          className="bg-white border-4 border-bih-navy px-4 py-3 text-bih-navy font-medium focus:outline-none focus:ring-4 focus:ring-bih-yellow/50">
          {PROVINCE_TAX_RATES.map((p) => (
            <option key={p.provinceCode} value={p.provinceCode}>{p.provinceCode} — {p.provinceName}</option>
          ))}
        </select>
        <input name="postalCode" placeholder="Postal Code *" required value={form.postalCode} onChange={handleChange} className={nbInput} />
      </div>

      {/* 运费选择区域 */}
      <div className="border-4 border-bih-navy bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="w-4 h-4 text-bih-navy" />
          <h3 className="text-bih-navy font-black uppercase text-sm">Shipping Method</h3>
        </div>

        {loadingRates && (
          <div className="flex items-center gap-2 text-bih-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Fetching freight rates…
          </div>
        )}

        {!loadingRates && shippingRates.length === 0 && (
          <p className="text-bih-gray-400 text-sm">Enter postal code above to see shipping rates.</p>
        )}

        {shippingRates.map((rate) => (
          <label key={rate.service} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-bih-yellow/20 border-b border-bih-navy/10 last:border-0">
            <input type="radio" name="shipping" value={rate.priceCad}
              checked={selectedRate === rate.priceCad}
              onChange={() => setSelectedRate(rate.priceCad)}
              className="accent-bih-navy w-4 h-4" />
            <div className="flex-1">
              <p className="text-bih-navy text-sm font-black">{rate.service}</p>
              <p className="text-bih-gray-500 text-xs">{rate.carrier} · {rate.etaDays}</p>
            </div>
            <div className="bg-bih-yellow border-2 border-bih-navy px-2 py-1">
              <span className="text-bih-navy font-black text-sm">${rate.priceCad.toLocaleString('en-CA')} CAD</span>
            </div>
          </label>
        ))}

        {ratesError && <p className="text-red-600 text-sm mt-2 font-bold">{ratesError}</p>}
      </div>

      <button type="submit"
        className="w-full flex items-center justify-center gap-2 bg-bih-yellow text-bih-navy border-4 border-bih-navy shadow-[4px_4px_0_#003366] font-black uppercase tracking-wider py-3 transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
      >
        Continue to Payment <ChevronRight className="w-4 h-4" />
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────
   步骤 2: Stripe 支付表单
───────────────────────────────────────── */
function PaymentForm({
  onBack,
}: {
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setPayError('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setPayError(error.message || 'Payment failed. Please try again.');
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      clearCart();
      navigate(`/order/success?pi=${paymentIntent.id}`);
    }

    setProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-black uppercase text-bih-navy border-b-4 border-bih-navy pb-3">
        Secure Payment
      </h2>

      {/* Stripe 支付元素 */}
      <div className="border-4 border-bih-navy bg-white p-4">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {payError && (
        <div className="border-4 border-red-600 bg-red-50 p-3">
          <p className="text-red-700 text-sm font-bold">{payError}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="flex-1 py-3 border-4 border-bih-navy text-bih-navy font-black uppercase tracking-wider hover:bg-bih-navy/5 transition-colors">
          ← Back
        </button>
        <button type="submit" disabled={!stripe || processing}
          className="flex-1 flex items-center justify-center gap-2 bg-bih-yellow text-bih-navy border-4 border-bih-navy shadow-[4px_4px_0_#003366] font-black uppercase tracking-wider py-3 transition-all active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {processing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
          ) : (
            <><ShieldCheck className="w-4 h-4" /> Pay Now</>
          )}
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────
   主 CheckoutPage 组件
───────────────────────────────────────── */
export default function CheckoutPage() {
  const { items, subtotalCad } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [clientSecret, setClientSecret] = useState('');
  const [breakdown, setBreakdown] = useState<{
    subtotal: number; tax: number; taxRate: number; shipping: number; total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 购物车为空跳回产品页
  useEffect(() => {
    if (items.length === 0) navigate('/products');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  async function handleShippingNext(info: { province: string }, shippingCad: number) {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ priceCad: i.product.priceCad, quantity: i.quantity })),
          provinceCode: info.province,
          shippingCad,
          customerEmail: (info as { email?: string }).email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.clientSecret) throw new Error(data.error || 'Failed to initialize payment');

      setClientSecret(data.clientSecret);
      setBreakdown(data.breakdown);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bih-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── 页面标题 + 步骤条 ── */}
        <div className="mb-8 flex items-center gap-4">
          <div className="bg-bih-yellow border-4 border-bih-navy p-2">
            <ShieldCheck className="w-6 h-6 text-bih-navy" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-bih-navy">Checkout</h1>
            <div className="flex items-center gap-2 mt-1 text-sm">
              <span className={`font-black uppercase ${step === 'shipping' ? 'text-bih-navy' : 'text-bih-gray-400 line-through'}`}>
                1. Shipping
              </span>
              <span className="text-bih-gray-400">→</span>
              <span className={`font-black uppercase ${step === 'payment' ? 'text-bih-navy' : 'text-bih-gray-400'}`}>
                2. Payment
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 border-4 border-red-600 bg-red-50 p-4">
            <p className="text-red-700 font-bold text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mb-6 flex items-center gap-2 text-bih-gray-500 font-bold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Setting up secure payment…
          </div>
        )}

        {/* ── 双列布局 ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* 左列：表单 */}
          <div className="lg:col-span-2 bg-white border-4 border-bih-navy shadow-[8px_8px_0_#003366] p-6">
            {step === 'shipping' && !loading && (
              <ShippingForm onNext={(info, shippingCad) => handleShippingNext(info as { province: string; email?: string }, shippingCad)} />
            )}

            {step === 'payment' && clientSecret && breakdown && (
              <>
                {/* 费用明细 */}
                <div className="mb-6 border-4 border-bih-navy p-4 bg-bih-gray-100">
                  <h3 className="text-bih-navy font-black uppercase text-sm mb-3">Order Total</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-bih-gray-500 font-bold">Subtotal</span>
                      <span className="text-bih-navy font-black">${breakdown.subtotal.toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bih-gray-500 font-bold">Freight (Manitoulin)</span>
                      <span className="text-bih-navy font-black">${breakdown.shipping.toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bih-gray-500 font-bold">Tax ({(breakdown.taxRate * 100).toFixed(3)}%)</span>
                      <span className="text-bih-navy font-black">${breakdown.tax.toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-4 border-bih-navy mt-2">
                      <span className="text-bih-navy font-black uppercase">Total Due</span>
                      <div className="bg-bih-yellow border-2 border-bih-navy px-2 py-0.5">
                        <span className="text-bih-navy font-black">${breakdown.total.toLocaleString('en-CA', { minimumFractionDigits: 2 })} CAD</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#003366',
                        colorBackground: '#ffffff',
                        colorText: '#003366',
                        fontFamily: 'system-ui, sans-serif',
                        borderRadius: '0px',
                      },
                      rules: {
                        '.Input': { border: '3px solid #003366', boxShadow: 'none' },
                        '.Input:focus': { border: '3px solid #FFC500', boxShadow: '0 0 0 3px rgba(255,197,0,0.3)' },
                        '.Tab': { border: '3px solid #003366' },
                        '.Tab--selected': { backgroundColor: '#FFC500', color: '#003366', fontWeight: '900' },
                      },
                    },
                  }}
                >
                  <PaymentForm
                    onBack={() => setStep('shipping')}
                  />
                </Elements>
              </>
            )}
          </div>

          {/* 右列：订单摘要 (sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-bih-navy shadow-[8px_8px_0_#003366] p-6 sticky top-24">
              <h2 className="text-bih-navy font-black uppercase text-lg border-b-4 border-bih-navy pb-3 mb-4">
                Your Order
              </h2>

              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 items-start">
                    <div className="w-10 h-10 bg-bih-gray-100 border-2 border-bih-navy flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-bih-navy/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-bih-navy font-black text-xs uppercase leading-tight truncate">{product.name}</p>
                      <p className="text-bih-gray-500 text-xs">× {quantity}</p>
                    </div>
                    <span className="text-bih-navy font-black text-sm shrink-0">
                      ${(product.priceCad * quantity).toLocaleString('en-CA')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-4 border-bih-navy pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-bih-gray-500 font-bold text-sm">Subtotal</span>
                  <span className="text-bih-navy font-black">${subtotalCad().toLocaleString('en-CA')} CAD</span>
                </div>
                <p className="text-xs text-bih-gray-400 mt-1">+ freight + applicable taxes</p>
              </div>

              {/* 安全标识 */}
              <div className="mt-4 pt-3 border-t border-bih-navy/20 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <p className="text-xs text-bih-gray-500">256-bit SSL encryption via Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
