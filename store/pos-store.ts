// store/pos-store.ts
import { create } from 'zustand';
import { CartItem, PaymentMethod, Invoice } from '@/types';
import { useInvoiceStore } from './invoice-store';
import { useInventoryStore } from './inventory-store';
import { useUiStore } from './ui-store';
import { toast } from '@/components/ui/toast-provider';

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

export const usePosStore = create<PosState>((set, get) => ({
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
    const { cartItems, activeCustomerId, paymentMethod } = get();
    if (cartItems.length === 0) return;

    const taxRate = useUiStore.getState().taxRate;
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const total = subtotal + subtotal * (taxRate / 100);

    const invoice: Invoice = {
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${Date.now()}`,
      customerId: activeCustomerId || undefined,
      lineItems: cartItems.map(item => ({
        itemId: item.itemId,
        description: item.title,
        price: item.price,
        quantity: item.quantity
      })),
      taxRate,
      discount: 0,
      total,
      paymentMethod: paymentMethod || undefined,
      createdAt: new Date().toISOString()
    };

    useInvoiceStore.getState().addInvoice(invoice);
    toast.success('Sale complete! Invoice created.');

    const setStatus = useInventoryStore.getState().setStatus;
    cartItems.forEach(item => {
      setStatus(item.itemId, 'SOLD');
    });

    get().clearCart();
  },
}));

export const selectCartSubtotal = (state: PosState): number => {
  return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const selectCartTotal = (state: PosState, taxRate: number): number => {
  const subtotal = selectCartSubtotal(state);
  return subtotal + subtotal * (taxRate / 100);
};
