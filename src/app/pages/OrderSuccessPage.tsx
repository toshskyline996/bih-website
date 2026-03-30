import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CheckCircle2, Clock, Mail, Package, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export function OrderSuccessPage() {
  const [params] = useSearchParams();
  const piId = params.get('pi') ?? '';
  const clearCart = useCartStore((s) => s.clearCart);

  const [qboDoc, setQboDoc]     = useState<string | null>(null);
  const [synced, setSynced]     = useState<boolean | null>(null);  // null = loading
  const [syncError, setSyncError] = useState<string | null>(null);

  // 清空购物车 — 在成功页挂载后执行，避免 CheckoutPage 的购物车守卫拦截导航
  useEffect(() => { clearCart(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 从 sessionStorage 读取订单元数据，完成 QBO 同步
  useEffect(() => {
    const raw = sessionStorage.getItem('bih-order-meta');
    if (!raw || !piId) {
      setSynced(false);
      return;
    }

    let meta: object;
    try {
      meta = JSON.parse(raw);
    } catch {
      setSynced(false);
      return;
    }

    // 调用 QBO 同步（已在 PaymentStep 里调用过一次，这里作为保险重试）
    fetch('/api/qbo-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stripePaymentIntentId: piId, ...meta }),
    })
      .then(async (r) => {
        const data = await r.json() as { qboDocNumber?: string; error?: string; detail?: string };
        if (!r.ok) {
          throw new Error(data.detail || data.error || 'QBO sync failed');
        }
        return data;
      })
      .then((data: { qboDocNumber?: string }) => {
        if (data.qboDocNumber) setQboDoc(data.qboDocNumber);
        setSyncError(null);
        setSynced(true);
      })
      .catch((err: unknown) => {
        setSyncError(err instanceof Error ? err.message : 'QBO sync failed');
        setSynced(false);
      })
      .finally(() => sessionStorage.removeItem('bih-order-meta'));
  }, [piId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">

        {/* ── 成功图标 ── */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Payment Received!
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {/* ── 订单状态卡片 ── */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6 mb-6">
          {/* 待审核提示 */}
          <div className="flex items-start gap-3 p-4 bg-[#FFC500]/5 border border-[#FFC500]/20 rounded-lg mb-4">
            <Clock className="w-5 h-5 text-[#FFC500] mt-0.5 shrink-0" />
            <div>
              <p className="text-[#FFC500] font-semibold text-sm">Order Under Review</p>
              <p className="text-gray-400 text-xs mt-1">
                Our team will review your order and contact you within <strong className="text-white">1–2 business days</strong> to confirm details and arrange delivery.
              </p>
            </div>
          </div>

          {/* 参考号 */}
          <div className="space-y-3">
            <InfoRow
              icon={<Package className="w-4 h-4 text-gray-500" />}
              label="Stripe Reference"
              value={piId ? `${piId.slice(0, 24)}…` : '—'}
              mono
            />
            {qboDoc && (
              <InfoRow
                icon={<CheckCircle2 className="w-4 h-4 text-green-400" />}
                label="QuickBooks Receipt"
                value={`#${qboDoc}`}
                mono
              />
            )}
            {synced === false && (
              <div className="space-y-1">
                <p className="text-xs text-gray-600">
                  QBO sync pending — your order is fully recorded in Stripe.
                </p>
                {syncError && (
                  <p className="text-xs text-red-400">
                    {syncError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── 后续步骤 ── */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-3 text-sm">What Happens Next</h3>
          <ol className="space-y-3">
            {[
              { icon: <Mail className="w-4 h-4" />,    text: 'You\'ll receive a payment confirmation email from Stripe.' },
              { icon: <Clock className="w-4 h-4" />,   text: 'Our team reviews your order and verifies product availability.' },
              { icon: <Package className="w-4 h-4" />, text: 'We confirm your order and arrange LTL shipment via Manitoulin Transport.' },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                <span className="w-6 h-6 rounded-full bg-[#1e1e1e] border border-[#333] flex items-center justify-center text-gray-500 shrink-0">
                  {step.icon}
                </span>
                {step.text}
              </li>
            ))}
          </ol>
        </div>

        {/* ── 操作按钮 ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/products"
            className="flex-1 py-3 border border-[#333] text-gray-400 font-semibold rounded-lg hover:border-[#FFC500] hover:text-white transition text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/contact"
            className="flex-1 py-3 bg-[#FFC500] text-[#003366] font-bold rounded-lg hover:bg-yellow-400 transition text-center flex items-center justify-center gap-2"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-gray-600 text-center mt-6">
          Questions? Email us at{' '}
          <a href="mailto:antonequipmentca@gmail.com" className="text-gray-400 hover:text-white transition">
            antonequipmentca@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  icon, label, value, mono,
}: {
  icon: React.ReactNode; label: string; value: string; mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`text-white ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
