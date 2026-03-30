import { Link } from 'react-router';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, PackageOpen } from 'lucide-react';
import { useCartStore, selectTotalItems, selectSubtotal } from '../store/cartStore';

export function CartPage() {
  const items      = useCartStore((s) => s.items);
  const totalItems = useCartStore(selectTotalItems);
  const subtotal   = useCartStore(selectSubtotal);
  const updateQty  = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  const fmt = (n: number) =>
    n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });

  // ─── 空购物车 ──────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 px-4">
        <PackageOpen className="w-16 h-16 text-[#FFC500]" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
        <p className="text-gray-400 text-center max-w-sm">
          Browse our excavator attachments and add items to get started.
        </p>
        <Link
          to="/products"
          className="px-6 py-3 bg-[#FFC500] text-[#003366] font-semibold rounded-lg hover:bg-yellow-400 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── 页头 ── */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-7 h-7 text-[#FFC500]" />
          <h1 className="text-3xl font-bold text-white">
            Cart
            <span className="ml-2 text-lg text-gray-400 font-normal">
              ({totalItems} item{totalItems !== 1 ? 's' : ''})
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── 商品列表 ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-[#111] border border-[#222] rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                {/* 黄色方块 icon 占位 */}
                <div className="w-16 h-16 rounded-lg bg-[#FFC500]/10 border border-[#FFC500]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#FFC500] text-2xl font-bold">
                    {item.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-[#FFC500] font-bold mt-1">
                    {fmt(item.priceCad)} <span className="text-gray-500 font-normal text-xs">/unit</span>
                  </p>
                </div>

                {/* 数量控制 */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQty(item.productId, item.qty - 1)}
                    className="w-8 h-8 rounded-md bg-[#1e1e1e] border border-[#333] text-white hover:border-[#FFC500] transition flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-white font-semibold">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.productId, item.qty + 1)}
                    className="w-8 h-8 rounded-md bg-[#1e1e1e] border border-[#333] text-white hover:border-[#FFC500] transition flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* 行合计 + 删除 */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-white font-bold w-24 text-right">
                    {fmt(item.priceCad * item.qty)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-500 hover:text-red-400 transition"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── 订单摘要 ── */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[#222] rounded-xl p-6 sticky top-24">
              <h2 className="text-white font-bold text-lg mb-4">Order Summary</h2>

              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-white">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Shipping</span>
                <span className="text-gray-500 italic">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>Tax</span>
                <span className="text-gray-500 italic">Calculated at checkout</span>
              </div>

              <div className="border-t border-[#222] pt-4 mb-5">
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Subtotal</span>
                  <span className="text-[#FFC500]">{fmt(subtotal)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFC500] text-[#003366] font-bold rounded-lg hover:bg-yellow-400 transition"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products"
                className="w-full text-center text-sm text-gray-500 hover:text-white transition mt-3 block"
              >
                ← Continue Shopping
              </Link>

              {/* 安全提示 */}
              <p className="text-xs text-gray-600 text-center mt-4">
                🔒 Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
