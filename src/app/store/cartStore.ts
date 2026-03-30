import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  qty: number;
  priceCad: number;
  weightKg: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      // 添加商品 — 若已存在则叠加数量
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),

      updateQty: (productId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, qty } : i
            ),
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'bih-cart',
      // 清理 localStorage 中字段不完整的旧条目，防止 undefined 崩溃
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.items = state.items.filter(
            (i) =>
              !!i.productId &&
              typeof i.name === 'string' &&
              typeof i.priceCad === 'number' &&
              typeof i.weightKg === 'number'
          );
        }
      },
    }
  )
);

// ─── 派生计算（选择器，不放进 store 避免 persist 序列化问题）────────────────
export const selectTotalItems = (s: CartStore) =>
  s.items.reduce((n, i) => n + i.qty, 0);

export const selectSubtotal = (s: CartStore) =>
  s.items.reduce((n, i) => n + i.qty * i.priceCad, 0);

export const selectTotalWeight = (s: CartStore) =>
  s.items.reduce((n, i) => n + i.qty * i.weightKg, 0);
