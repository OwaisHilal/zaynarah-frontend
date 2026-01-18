// src/stores/orders/__tests__/orders.store.advanced.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useOrdersDomainStore } from '../orders.store';
import * as ordersApi from '@/features/orders/services/ordersApi';

vi.mock('@/features/orders/services/ordersApi');

const resetStore = () => {
  useOrdersDomainStore.setState({
    entities: {},
    ids: [],
    page: 1,
    limit: 10,
    hasMore: false,
    hydrated: false,
  });
};

describe('orders.store — adversarial behavior', () => {
  beforeEach(() => {
    resetStore();
    vi.resetAllMocks();
  });

  it('hydrate is idempotent under concurrent calls', async () => {
    ordersApi.fetchMyOrders.mockResolvedValueOnce([]);

    await Promise.all([
      useOrdersDomainStore.getState().hydrate(),
      useOrdersDomainStore.getState().hydrate(),
      useOrdersDomainStore.getState().hydrate(),
    ]);

    expect(ordersApi.fetchMyOrders).toHaveBeenCalledTimes(1);
    expect(useOrdersDomainStore.getState().hydrated).toBe(true);
  });

  it('hydrate does not mark hydrated when fetch throws', async () => {
    ordersApi.fetchMyOrders.mockRejectedValueOnce(new Error('fail'));

    await expect(useOrdersDomainStore.getState().hydrate()).rejects.toThrow();

    expect(useOrdersDomainStore.getState().hydrated).toBe(false);
  });

  it('handles non-array backend responses safely', async () => {
    ordersApi.fetchMyOrders
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ orders: null })
      .mockResolvedValueOnce({ data: null });

    await useOrdersDomainStore.getState().fetchPage(1);
    await useOrdersDomainStore.getState().fetchPage(2);
    await useOrdersDomainStore.getState().fetchPage(3);

    const state = useOrdersDomainStore.getState();
    expect(state.ids).toEqual([]);
    expect(state.entities).toEqual({});
  });

  it('drops duplicate ids keeping last occurrence', async () => {
    ordersApi.fetchMyOrders.mockResolvedValueOnce([
      { _id: 'o1', status: 'paid' },
      { _id: 'o1', status: 'shipped' },
    ]);

    await useOrdersDomainStore.getState().fetchPage(1);

    const state = useOrdersDomainStore.getState();
    expect(state.ids).toEqual(['o1']);
    expect(state.entities.o1.status).toBe('shipped');
  });

  it('normalizes pathological status values', async () => {
    ordersApi.fetchMyOrders.mockResolvedValueOnce([
      { _id: 'o1', status: null },
      { _id: 'o2', status: '' },
      { _id: 'o3', status: 123 },
    ]);

    await useOrdersDomainStore.getState().fetchPage(1);

    const state = useOrdersDomainStore.getState();
    expect(state.entities.o1.status).toBe('placed');
    expect(state.entities.o2.status).toBe('placed');
    expect(state.entities.o3.status).toBe('123');
  });

  it('page jump replaces state deterministically', async () => {
    ordersApi.fetchMyOrders
      .mockResolvedValueOnce([{ _id: 'o1' }])
      .mockResolvedValueOnce([{ _id: 'o3' }]);

    await useOrdersDomainStore.getState().fetchPage(1);
    await useOrdersDomainStore.getState().fetchPage(3);

    const state = useOrdersDomainStore.getState();
    expect(state.page).toBe(3);
    expect(state.ids).toEqual(['o3']);
    expect(state.entities.o1).toBeUndefined();
  });

  it('hasMore false when backend returns more than limit', async () => {
    ordersApi.fetchMyOrders.mockResolvedValueOnce(
      Array.from({ length: 12 }, (_, i) => ({ _id: `o${i}` }))
    );

    await useOrdersDomainStore.getState().fetchPage(1);

    expect(useOrdersDomainStore.getState().hasMore).toBe(false);
  });

  it('getById remains safe before and after failed fetch', async () => {
    ordersApi.fetchMyOrders.mockRejectedValueOnce(new Error('fail'));

    await expect(
      useOrdersDomainStore.getState().fetchPage(1)
    ).rejects.toThrow();

    expect(useOrdersDomainStore.getState().getById('o1')).toBe(null);
  });
});
