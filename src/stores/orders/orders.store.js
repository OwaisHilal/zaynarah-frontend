// frontend/src/stores/orders/orders.store.js
import { create } from 'zustand';
import { fetchMyOrders } from '@/features/orders/services/ordersApi';

const normalizeStatus = (status) => {
  if (!status) return 'placed';
  return String(status).toLowerCase();
};

const extractOrdersArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.orders)) return response.orders;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

export const useOrdersDomainStore = create((set, get) => ({
  entities: {},
  ids: [],
  page: 1,
  limit: 10,
  hasMore: false,
  hydrated: false,
  _hydrating: false,

  hydrate: async () => {
    if (get().hydrated || get()._hydrating) return;

    set({ _hydrating: true });

    try {
      await get().fetchPage(1);
      set({ hydrated: true });
    } finally {
      set({ _hydrating: false });
    }
  },

  fetchPage: async (page) => {
    const { limit } = get();
    const response = await fetchMyOrders({ page, limit });
    const orders = extractOrdersArray(response);

    const entities = {};
    const idsSet = new Set();

    for (const o of orders) {
      const id = o?._id || o?.id;
      if (!id) continue;

      entities[id] = {
        ...o,
        id,
        status: normalizeStatus(o.status),
      };

      idsSet.add(id);
    }

    set({
      entities,
      ids: Array.from(idsSet),
      page,
      hasMore: orders.length === limit,
    });
  },

  getById: (id) => get().entities[id] || null,
}));
