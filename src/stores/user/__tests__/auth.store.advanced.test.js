// frontend/src/stores/user/__tests__/auth.store.advanced.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../auth.store';
import { useUserDomainStore } from '../user.store';

const reset = () => {
  localStorage.clear();
  sessionStorage.clear();
  useAuthStore.setState({ loading: false, error: '', hydrated: false });
  useUserDomainStore.getState().resetUser();
};

describe('auth.store — adversarial scenarios', () => {
  beforeEach(reset);

  it('does not hydrate user when token exists but user is missing', () => {
    localStorage.setItem('token', 'x');

    useAuthStore.getState().hydrateSession();

    expect(useUserDomainStore.getState().user).toBe(null);
    expect(useAuthStore.getState().hydrated).toBe(true);
  });

  it('ignores corrupted user JSON safely', () => {
    localStorage.setItem('token', 'x');
    localStorage.setItem('user', '{bad json');

    useAuthStore.getState().hydrateSession();

    expect(useUserDomainStore.getState().user).toBe(null);
    expect(useAuthStore.getState().hydrated).toBe(true);
  });

  it('never treats hydrated=true as authenticated', () => {
    useAuthStore.getState().hydrateSession();

    expect(useAuthStore.getState().hydrated).toBe(true);
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });

  it('clears previous storage before login writes new data', async () => {
    localStorage.setItem('token', 'old');
    sessionStorage.setItem('token', 'old');

    await useAuthStore
      .getState()
      .login({ email: 'test@test.com', password: 'x', rememberMe: true });

    expect(sessionStorage.getItem('token')).toBe(null);
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  it('does not partially authenticate when backend returns malformed payload', async () => {
    await useAuthStore
      .getState()
      .login({ email: 'badshape@test.com', password: 'x', rememberMe: false });

    expect(useUserDomainStore.getState().user).toBe(null);
    expect(useAuthStore.getState().error).toBe('');
    expect(sessionStorage.getItem('token')).toBe(null);
  });

  it('handles logout during in-flight login safely', async () => {
    const loginPromise = useAuthStore
      .getState()
      .login({ email: 'slow@test.com', password: 'x', rememberMe: true });

    useAuthStore.getState().logout();

    await loginPromise;

    expect(useUserDomainStore.getState().user).toBe(null);
    expect(localStorage.getItem('token')).toBe(null);
  });

  it('storage priority always favors localStorage over sessionStorage', () => {
    sessionStorage.setItem(
      'user',
      JSON.stringify({ _id: 's', role: 'customer' })
    );
    sessionStorage.setItem('token', 's');

    localStorage.setItem(
      'user',
      JSON.stringify({ _id: 'l', role: 'customer' })
    );
    localStorage.setItem('token', 'l');

    useAuthStore.getState().hydrateSession();

    expect(useUserDomainStore.getState().user._id).toBe('l');
  });
});
