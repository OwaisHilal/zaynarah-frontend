// frontend/src/stores/checkout/__tests__/checkout.ui.store.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { useCheckoutUIStore } from '../checkout.ui.store';

const resetUI = () => {
  useCheckoutUIStore.setState({
    currentStep: 1,
    totalSteps: 5,
    loading: false,
    error: '',
  });
};

describe('checkout.ui.store — baseline behavior', () => {
  beforeEach(() => {
    resetUI();
  });

  it('starts with default UI state', () => {
    const state = useCheckoutUIStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.totalSteps).toBe(5);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('');
  });

  it('next advances step but never exceeds totalSteps', () => {
    for (let i = 0; i < 10; i++) {
      useCheckoutUIStore.getState().next();
    }

    expect(useCheckoutUIStore.getState().currentStep).toBe(5);
  });

  it('back decreases step but never goes below 1', () => {
    useCheckoutUIStore.getState().back();
    expect(useCheckoutUIStore.getState().currentStep).toBe(1);

    useCheckoutUIStore.setState({ currentStep: 3 });
    useCheckoutUIStore.getState().back();
    expect(useCheckoutUIStore.getState().currentStep).toBe(2);
  });

  it('next clears error automatically', () => {
    useCheckoutUIStore.setState({
      currentStep: 1,
      error: 'invalid',
    });

    useCheckoutUIStore.getState().next();
    expect(useCheckoutUIStore.getState().error).toBe('');
  });

  it('back clears error automatically', () => {
    useCheckoutUIStore.setState({
      currentStep: 3,
      error: 'invalid',
    });

    useCheckoutUIStore.getState().back();
    expect(useCheckoutUIStore.getState().error).toBe('');
  });

  it('setLoading toggles loading flag deterministically', () => {
    useCheckoutUIStore.getState().setLoading(true);
    expect(useCheckoutUIStore.getState().loading).toBe(true);

    useCheckoutUIStore.getState().setLoading(false);
    expect(useCheckoutUIStore.getState().loading).toBe(false);
  });

  it('setError stores error verbatim', () => {
    useCheckoutUIStore.getState().setError('fail');
    expect(useCheckoutUIStore.getState().error).toBe('fail');
  });

  it('reset restores full initial UI state', () => {
    useCheckoutUIStore.setState({
      currentStep: 4,
      loading: true,
      error: 'err',
    });

    useCheckoutUIStore.getState().reset();

    const state = useCheckoutUIStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('');
  });
});

describe('checkout.ui.store — adversarial behavior', () => {
  beforeEach(() => {
    resetUI();
  });

  it('ignores invalid manual step corruption', () => {
    useCheckoutUIStore.setState({ currentStep: 999 });

    useCheckoutUIStore.getState().next();
    expect(useCheckoutUIStore.getState().currentStep).toBe(5);

    useCheckoutUIStore.setState({ currentStep: -10 });
    useCheckoutUIStore.getState().back();
    expect(useCheckoutUIStore.getState().currentStep).toBe(1);
  });

  it('allows totalSteps mutation without crashing navigation', () => {
    useCheckoutUIStore.setState({ totalSteps: 3 });

    useCheckoutUIStore.getState().next();
    useCheckoutUIStore.getState().next();
    useCheckoutUIStore.getState().next();

    expect(useCheckoutUIStore.getState().currentStep).toBe(3);
  });
});
