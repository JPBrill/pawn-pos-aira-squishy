import { create } from 'zustand';
import { CartItem, PaymentMethod } from '@/types';

interface PosState {
  cartItems: CartItem[];
  activeCustomerId: string | null;
  paymentMethod: PaymentMethod | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setActiveCustomer: (id: string | null) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  clearCart: () => void;
  completeSale: () => void;
}

export const usePosStore = create<PosState>((set) => ({
  cartItems: [],
  activeCustomerId: null,
  paymentMethod: null,
  addToCart: (item) =>
    set((state) => {
      const existing = state.cartItems.find((i) => i.itemId === item.itemId);
      if (existing) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.itemId === item.itemId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { cartItems: [...state.cartItems, item] };
    }),
  removeFromCart: (itemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((i) => i.itemId !== itemId),
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        i.itemId === itemId ? { ...i, quantity } : i
      ),
    })),
  setActiveCustomer: (id) => set({ activeCustomerId: id }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  clearCart: () => set({ cartItems: [], activeCustomerId: null, paymentMethod: null }),
  completeSale: () => {
    // TODO stub: log to console for now, will wire to inventory + invoices in Phase 3
    console.log('Sale completed!');
    set({ cartItems: [], activeCustomerId: null, paymentMethod: null });
  },
}));

export const selectCartSubtotal = (state: PosState): number => {
  return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const selectCartTotal = (state: PosState, taxRate: number): number => {
  const subtotal = selectCartSubtotal(state);
  return subtotal + subtotal * (taxRate / 100);
};
