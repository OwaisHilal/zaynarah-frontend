// src/stores/products/products.ui.store.js
import { create } from 'zustand';

export const useProductsUIStore = create((set) => ({
  category: '',
  priceMax: 1000,
  sort: 'createdAt:desc',
  page: 1,
  sheetOpen: false,

  setCategory: (v) => set({ category: v, page: 1 }),
  setPriceMax: (v) => set({ priceMax: v, page: 1 }),
  setSort: (v) => set({ sort: v, page: 1 }),
  setPage: (v) => set({ page: v }),
  setSheetOpen: (v) => set({ sheetOpen: v }),

  reset: () =>
    set({
      category: '',
      priceMax: 1000,
      sort: 'createdAt:desc',
      page: 1,
      sheetOpen: false,
    }),
}));
