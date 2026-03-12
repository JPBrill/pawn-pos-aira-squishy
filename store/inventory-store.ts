import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InventoryItem, ItemStatus } from '@/types';

interface InventoryFilters {
  status?: ItemStatus;
  search?: string;
  category?: string;
}

interface InventoryState {
  items: InventoryItem[];
  filters: InventoryFilters;
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  setStatus: (id: string, status: ItemStatus) => void;
  setFilters: (filters: Partial<InventoryFilters>) => void;
  clearFilters: () => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      items: [],
      filters: {},
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      setStatus: (id, status) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, status } : item
          ),
        })),
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      clearFilters: () => set({ filters: {} }),
    }),
    {
      name: 'pawn-inventory',
    }
  )
);

export const selectFilteredItems = (state: InventoryState): InventoryItem[] => {
  return state.items.filter((item) => {
    if (state.filters.status && item.status !== state.filters.status) {
      return false;
    }
    if (state.filters.category && item.category !== state.filters.category) {
      return false;
    }
    if (state.filters.search) {
      const searchLower = state.filters.search.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};
