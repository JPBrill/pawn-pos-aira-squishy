import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  sidebarOpen: boolean;
  activeModal: string | null;
  shopName: string;
  taxRate: number;
  currency: string;
  toggleSidebar: () => void;
  openModal: (name: string) => void;
  closeModal: () => void;
  updateSettings: (settings: Partial<{ shopName: string; taxRate: number; currency: string }>) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      activeModal: null,
      shopName: 'My Pawn Shop',
      taxRate: 8.25,
      currency: 'USD',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      openModal: (name) => set({ activeModal: name }),
      closeModal: () => set({ activeModal: null }),
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'pawn-ui',
      partialize: (state) => ({
        shopName: state.shopName,
        taxRate: state.taxRate,
        currency: state.currency,
      }),
    }
  )
);
