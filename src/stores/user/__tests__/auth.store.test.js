// frontend/src/stores/user/__tests__/auth.store.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../auth.store';
import { useUserDomainStore } from '../user.store';

const resetAll = () => {
  localStorage.clear();
  sessionStorage.clear();
  useAuthStore.setState({ loading: false, error: '', hydrated: false });
  useUserDomainStore.getState().resetUser();
};

describe('auth.store', () => {
  beforeEach(resetAll);

  it('hydrates session idempotently when token exists', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ _id: 'u1', role: 'customer' })
    );

    useAuthStore.getState().hydrateSession();
    useAuthStore.getState().hydrateSession();

    expect(useUserDomainStore.getState().user._id).toBe('u1');
    expect(useAuthStore.getState().hydrated).toBe(true);
  });

  it('logs in and respects rememberMe=false', async () => {
    await useAuthStore
      .getState()
      .login({ email: 'test@test.com', password: 'x', rememberMe: false });

    expect(sessionStorage.getItem('token')).toBe('test-token');
    expect(localStorage.getItem('token')).toBe(null);
  });

  it('logs in and respects rememberMe=true', async () => {
    await useAuthStore
      .getState()
      .login({ email: 'test@test.com', password: 'x', rememberMe: true });

    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('sets error on failed login', async () => {
    await useAuthStore
      .getState()
      .login({ email: 'fail@test.com', password: 'x', rememberMe: false });

    expect(useAuthStore.getState().error).toBe('Invalid credentials');
  });

  it('logout resets everything deterministically', () => {
    localStorage.setItem('token', 'x');
    localStorage.setItem('user', JSON.stringify({ _id: 'u1' }));
    useUserDomainStore.getState().setUser({ _id: 'u1' });

    useAuthStore.getState().logout();

    expect(useUserDomainStore.getState().user).toBe(null);
    expect(localStorage.getItem('token')).toBe(null);
    expect(useAuthStore.getState().hydrated).toBe(true);
  });
});
