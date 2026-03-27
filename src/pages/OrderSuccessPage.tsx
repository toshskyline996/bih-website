import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Mail } from 'lucide-react';

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const paymentIntentId = params.get('pi') || params.get('payment_intent');
  const [copied, setCopied] = useState(false);

  // 滚动到顶部
  useEffect(() => { window.scrollTo(0, 0); }, []);

  function copyOrderId() {
    if (paymentIntentId) {
      navigator.clipboard.writeText(paymentIntentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* 成功图标 */}
        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-white/50 mb-8">
          Thank you for your order. A confirmation email will be sent to you shortly.
        </p>

        {/* 订单编号 */}
        {paymentIntentId && (
          <div className="bg-gray-900 border border-white/10 rounded-xl p-4 mb-8">
            <p className="text-white/40 text-xs mb-2">Order Reference</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-bih-yellow font-mono text-sm truncate">
                {paymentIntentId}
              </code>
              <button
                onClick={copyOrderId}
                className="text-white/40 hover:text-white text-xs border border-white/10 rounded px-2 py-1 hover:border-white/30 transition-colors shrink-0"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* 下一步说明 */}
        <div className="space-y-3 mb-8 text-left">
          <div className="flex gap-3 items-start">
            <Mail className="w-5 h-5 text-bih-yellow shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Confirmation Email</p>
              <p className="text-white/40 text-xs">
                You'll receive an order summary with invoice details within 15 minutes.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Package className="w-5 h-5 text-bih-yellow shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Shipping & Fulfillment</p>
              <p className="text-white/40 text-xs">
                Our team will contact you within 1 business day to confirm your shipping schedule via Manitoulin Transport.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 bg-bih-yellow text-bih-navy font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
