import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quote } from '@/types';

interface QuoteState {
  quotes: Quote[];
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  removeQuote: (id: string) => void;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set) => ({
      quotes: [],
      addQuote: (quote) => set((state) => ({ quotes: [...state.quotes, quote] })),
      updateQuote: (id, updates) =>
        set((state) => ({
          quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...updates } : q)),
        })),
      removeQuote: (id) =>
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
        })),
      // TODO: convertToInvoice will be implemented in Phase 4
    }),
    {
      name: 'pawn-quotes',
    }
  )
);
