import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer } from '@/types';

interface CustomerState {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: [],
      addCustomer: (customer) =>
        set((state) => ({ customers: [...state.customers, customer] })),
      updateCustomer: (id, updates) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      removeCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'pawn-customers',
    }
  )
);
