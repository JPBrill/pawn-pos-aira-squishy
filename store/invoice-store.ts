import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invoice } from '@/types';

interface InvoiceState {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set) => ({
      invoices: [],
      addInvoice: (invoice) =>
        set((state) => ({ invoices: [...state.invoices, invoice] })),
    }),
    {
      name: 'pawn-invoices',
    }
  )
);
