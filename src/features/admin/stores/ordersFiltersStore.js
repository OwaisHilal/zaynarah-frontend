// src/features/admin/stores/ordersFiltersStore.js

import { create } from 'zustand';

const initialState = {
  page: 1,
  status: '',
  paymentStatus: '',
  from: '',
  to: '',
};

export const useOrdersFiltersStore = create((set) => ({
  ...initialState,

  setPage: (page) =>
    set(() => ({
      page,
    })),

  setStatus: (status) =>
    set(() => ({
      status,
      page: 1,
    })),

  setPaymentStatus: (paymentStatus) =>
    set(() => ({
      paymentStatus,
      page: 1,
    })),

  setFrom: (from) =>
    set(() => ({
      from,
      page: 1,
    })),

  setTo: (to) =>
    set(() => ({
      to,
      page: 1,
    })),

  resetFilters: () =>
    set(() => ({
      ...initialState,
    })),
}));
