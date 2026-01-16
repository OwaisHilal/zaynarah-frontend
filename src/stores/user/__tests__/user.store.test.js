// frontend/src/stores/user/__tests__/user.store.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { useUserDomainStore } from '../user.store';

const resetUser = () => {
  localStorage.clear();
  sessionStorage.clear();
  useUserDomainStore.getState().resetUser();
};

describe('user.store', () => {
  beforeEach(resetUser);

  it('sets and resets user correctly', () => {
    useUserDomainStore.getState().setUser({ _id: 'u1', role: 'admin' });
    expect(useUserDomainStore.getState().isAdmin()).toBe(true);

    useUserDomainStore.getState().resetUser();
    expect(useUserDomainStore.getState().user).toBe(null);
  });

  it('syncs profile updates to storage', async () => {
    sessionStorage.setItem('token', 'x');

    const updated = await useUserDomainStore.getState().fetchProfile();

    expect(JSON.parse(sessionStorage.getItem('user'))._id).toBe(updated._id);
  });
});
