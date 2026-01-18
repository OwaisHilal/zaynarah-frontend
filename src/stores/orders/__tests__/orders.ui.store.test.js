// src/stores/orders/__tests__/orders.ui.store.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { useOrdersUIStore } from '../orders.ui.store';

const resetUI = () => {
  useOrdersUIStore.setState({
    loading: false,
    error: null,
    selectedOrderId: null,
  });
};

describe('orders.ui.store — baseline behavior', () => {
  beforeEach(() => {
    resetUI();
  });

  it('starts with default UI state', () => {
    const state = useOrdersUIStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.selectedOrderId).toBe(null);
  });

  it('setLoading toggles loading flag', () => {
    useOrdersUIStore.getState().setLoading(true);
    expect(useOrdersUIStore.getState().loading).toBe(true);

    useOrdersUIStore.getState().setLoading(false);
    expect(useOrdersUIStore.getState().loading).toBe(false);
  });

  it('setError stores error payload verbatim', () => {
    const err = { message: 'fail' };

    useOrdersUIStore.getState().setError(err);
    expect(useOrdersUIStore.getState().error).toBe(err);
  });

  it('selectOrder sets selectedOrderId without validation', () => {
    useOrdersUIStore.getState().selectOrder('o1');
    expect(useOrdersUIStore.getState().selectedOrderId).toBe('o1');

    useOrdersUIStore.getState().selectOrder(null);
    expect(useOrdersUIStore.getState().selectedOrderId).toBe(null);
  });

  it('clearSelection resets only selectedOrderId', () => {
    useOrdersUIStore.setState({
      loading: true,
      error: 'err',
      selectedOrderId: 'o1',
    });

    useOrdersUIStore.getState().clearSelection();

    const state = useOrdersUIStore.getState();
    expect(state.selectedOrderId).toBe(null);
    expect(state.loading).toBe(true);
    expect(state.error).toBe('err');
  });

  it('reset restores full initial UI state', () => {
    useOrdersUIStore.setState({
      loading: true,
      error: 'err',
      selectedOrderId: 'o1',
    });

    useOrdersUIStore.getState().reset();

    const state = useOrdersUIStore.getState();
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
    expect(state.selectedOrderId).toBe(null);
  });
});
