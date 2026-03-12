import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InventoryItem, ItemStatus } from '@/types';
import { useShallow } from 'zustand/react/shallow';

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

export const useFilteredItems = () =>
  useInventoryStore(
    useShallow((state) => {
      const { items, filters } = state;
      return items.filter((item) => {
        if (filters.status && item.status !== filters.status) return false;
        if (filters.category && item.category !== filters.category) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          return (
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q)
          );
        }
        return true;
      });
    })
  );
