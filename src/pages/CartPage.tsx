import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

/* NeoBrutalism card — 4px 粗边框 + 硬阴影，匹配 Anton Equipment 风格，替换为 BIH 配色 */
const nbCard = 'bg-white border-4 border-bih-navy shadow-[8px_8px_0_#003366]';
const nbBtn = 'inline-flex items-center justify-center gap-2 border-4 border-bih-navy shadow-[4px_4px_0_#003366] font-black uppercase tracking-wider transition-all active:shadow-none active:translate-x-1 active:translate-y-1';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotalCad } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bih-gray-100 flex items-center justify-center px-4 py-20">
        <div className={`${nbCard} p-12 text-center max-w-sm w-full`}>
          <ShoppingCart className="w-16 h-16 text-bih-navy/20 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase text-bih-navy mb-2">Cart is Empty</h2>
          <p className="text-bih-gray-500 text-sm mb-6">Browse our heavy equipment attachments to get started.</p>
          <Link
            to="/products"
            className={`${nbBtn} bg-bih-yellow text-bih-navy px-6 py-3 w-full`}
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bih-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ── 标题 ── */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-bih-yellow border-4 border-bih-navy p-2">
            <ShoppingCart className="w-6 h-6 text-bih-navy" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-bih-navy">
            Shopping Cart
            <span className="ml-3 text-lg font-bold text-bih-gray-400 normal-case">
              ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── 商品表格 ── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className={`${nbCard} p-4`}>
                <div className="flex gap-4 items-start">
                  {/* 图片区域 */}
                  <div className="w-20 h-20 bg-bih-gray-100 border-2 border-bih-navy flex items-center justify-center shrink-0">
                    <Package className="w-8 h-8 text-bih-navy/30" />
                  </div>

                  {/* 产品信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-bih-navy font-black text-sm uppercase leading-tight mb-1">
                      {product.name}
                    </h3>
                    <p className="text-bih-gray-500 text-xs mb-1">
                      SKU: {product.id.toUpperCase()}
                    </p>
                    <p className="text-bih-gray-500 text-xs mb-3">
                      Fits {product.tonnageRange[0]}–{product.tonnageRange[1]}t · {product.weightKg} kg shipping weight
                    </p>

                    {/* 数量步进器 */}
                    <div className="flex items-center gap-0 border-4 border-bih-navy w-fit">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 bg-white hover:bg-bih-yellow flex items-center justify-center transition-colors border-r-4 border-bih-navy"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 text-bih-navy" />
                      </button>
                      <span className="text-bih-navy font-black font-mono w-10 text-center text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 bg-white hover:bg-bih-yellow flex items-center justify-center transition-colors border-l-4 border-bih-navy"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 text-bih-navy" />
                      </button>
                    </div>
                  </div>

                  {/* 价格 + 删除 */}
                  <div className="text-right shrink-0">
                    <div className="bg-bih-yellow border-4 border-bih-navy px-3 py-1 mb-2 inline-block">
                      <p className="text-bih-navy font-black text-lg leading-tight">
                        ${(product.priceCad * quantity).toLocaleString('en-CA')}
                      </p>
                      <p className="text-bih-navy/60 text-[10px] font-bold">CAD</p>
                    </div>
                    <div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 继续购物链接 */}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-bih-navy font-bold text-sm hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* ── 订单合计 ── */}
          <div className="lg:col-span-1">
            <div className={`${nbCard} p-6 sticky top-24`}>
              <h2 className="text-bih-navy font-black uppercase text-lg mb-4 border-b-4 border-bih-navy pb-3">
                Cart Total
              </h2>

              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-bih-gray-500 font-bold">Subtotal</span>
                  <span className="text-bih-navy font-black">${subtotalCad().toLocaleString('en-CA')} CAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bih-gray-500 font-bold">Shipping</span>
                  <span className="text-bih-gray-400 text-xs">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bih-gray-500 font-bold">Tax (GST/HST)</span>
                  <span className="text-bih-gray-400 text-xs">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t-4 border-bih-navy pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-bih-navy font-black uppercase">Total</span>
                  <span className="text-2xl font-black text-bih-navy">
                    ${subtotalCad().toLocaleString('en-CA')}
                    <span className="text-sm ml-1 text-bih-gray-500">CAD</span>
                  </span>
                </div>
                <p className="text-[11px] text-bih-gray-400 mt-1">+ shipping & applicable taxes</p>
              </div>

              <Link
                to="/checkout"
                className={`${nbBtn} bg-bih-yellow text-bih-navy px-6 py-3 w-full text-sm`}
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
