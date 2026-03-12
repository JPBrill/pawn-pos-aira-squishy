import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  inventory: any[];
  customers: any[];
  cart: any[];
  quotes: any[];
  invoices: any[];
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      inventory: [],
      customers: [],
      cart: [],
      quotes: [],
      invoices: [],
      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
      removeFromCart: (itemId) => set((state) => ({ cart: state.cart.filter(i => i.id !== itemId) })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'pawn-shop-storage',
    }
  )
);
