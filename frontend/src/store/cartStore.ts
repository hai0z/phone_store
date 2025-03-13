import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  variant_id: number;
  quantity: number;
}

interface Order {
  items: CartItem[];
  total: number;
  shipping_address?: string;
  payment_method?: string;
  voucher_code?: string;
  discount?: number;
  address_id?: number;
  note?: string;
}

interface CartStore {
  items: CartItem[];
  order: Order | null;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  setOrder: (order: Order) => void;
  clearOrder: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      order: null,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.variant_id === item.variant_id
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.variant_id === item.variant_id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variant_id !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.variant_id === variantId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      setOrder: (order) => set({ order }),
      clearOrder: () => set({ order: null }),
    }),
    {
      name: "cart-storage",
    }
  )
);
