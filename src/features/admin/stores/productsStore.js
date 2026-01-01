// src/features/admin/stores/productsStore.js

import { create } from 'zustand';

const initialState = {
  page: 1,
  category: '',
  searchInput: '',
  search: '',
  selectedIds: [],
};

export const useProductsStore = create((set) => ({
  ...initialState,

  setPage: (page) =>
    set(() => ({
      page,
    })),

  setCategory: (category) =>
    set(() => ({
      category,
      page: 1,
    })),

  setSearchInput: (searchInput) =>
    set(() => ({
      searchInput,
    })),

  applySearch: (search) =>
    set(() => ({
      search,
      page: 1,
    })),

  toggleSelect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id],
    })),

  toggleSelectAll: (ids) =>
    set((state) => ({
      selectedIds: state.selectedIds.length === ids.length ? [] : ids,
    })),

  clearSelection: () =>
    set(() => ({
      selectedIds: [],
    })),
}));
