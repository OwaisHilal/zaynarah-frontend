// src/stores/orders/__tests__/orders.store.test.js
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

describe('orders.store — baseline behavior', () => {
  beforeEach(() => {
    resetStore();
    vi.resetAllMocks();
  });

  it('starts with empty normalized state', () => {
    const state = useOrdersDomainStore.getState();
    expect(state.entities).toEqual({});
    expect(state.ids).toEqual([]);
    expect(state.hydrated).toBe(false);
  });

  it('hydrates exactly once and fetches page 1', async () => {
    ordersApi.fetchMyOrders.mockResolvedValueOnce([]);

    await useOrdersDomainStore.getState().hydrate();
    await useOrdersDomainStore.getState().hydrate();

    expect(ordersApi.fetchMyOrders).toHaveBeenCalledTimes(1);
    expect(ordersApi.fetchMyOrders).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
    });
    expect(useOrdersDomainStore.getState().hydrated).toBe(true);
  });

  it('normalizes id and status correctly', async () => {
    ordersApi.fetchMyOrders.mockResolvedValueOnce([
      { _id: 'o1', status: 'PAID' },
      { id: 'o2' },
    ]);

    await useOrdersDomainStore.getState().fetchPage(1);

    const state = useOrdersDomainStore.getState();

    expect(state.ids).toEqual(['o1', 'o2']);
    expect(state.entities.o1.status).toBe('paid');
    expect(state.entities.o2.status).toBe('placed');
  });

  it('drops orders without valid id', async () => {
    ordersApi.fetchMyOrders.mockResolvedValueOnce([
      { status: 'paid' },
      { _id: 'o1', status: 'paid' },
    ]);

    await useOrdersDomainStore.getState().fetchPage(1);

    const state = useOrdersDomainStore.getState();
    expect(state.ids).toEqual(['o1']);
    expect(Object.keys(state.entities)).toEqual(['o1']);
  });

  it('replaces entities and ids on page change', async () => {
    ordersApi.fetchMyOrders
      .mockResolvedValueOnce([{ _id: 'o1' }])
      .mockResolvedValueOnce([{ _id: 'o2' }]);

    await useOrdersDomainStore.getState().fetchPage(1);
    await useOrdersDomainStore.getState().fetchPage(2);

    const state = useOrdersDomainStore.getState();
    expect(state.page).toBe(2);
    expect(state.ids).toEqual(['o2']);
    expect(state.entities.o1).toBeUndefined();
  });

  it('sets hasMore correctly based on limit', async () => {
    ordersApi.fetchMyOrders.mockResolvedValueOnce(
      Array.from({ length: 10 }, (_, i) => ({ _id: `o${i}` }))
    );

    await useOrdersDomainStore.getState().fetchPage(1);

    expect(useOrdersDomainStore.getState().hasMore).toBe(true);

    ordersApi.fetchMyOrders.mockResolvedValueOnce([{ _id: 'o1' }]);

    await useOrdersDomainStore.getState().fetchPage(2);

    expect(useOrdersDomainStore.getState().hasMore).toBe(false);
  });

  it('getById returns order or null', async () => {
    ordersApi.fetchMyOrders.mockResolvedValueOnce([{ _id: 'o1' }]);

    await useOrdersDomainStore.getState().fetchPage(1);

    expect(useOrdersDomainStore.getState().getById('o1')).not.toBe(null);
    expect(useOrdersDomainStore.getState().getById('missing')).toBe(null);
  });
});
