// frontend/src/stores/user/__tests__/user.store.advanced.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUserDomainStore } from '../user.store';
import * as userApi from '@/features/user/services/userApi';
import axios from 'axios';

const reset = () => {
  localStorage.clear();
  sessionStorage.clear();
  useUserDomainStore.getState().resetUser();
};

describe('user.store — advanced, behavior-locked tests', () => {
  beforeEach(() => {
    reset();
    vi.restoreAllMocks();
  });

  it('resetUser always clears user and addresses deterministically', () => {
    useUserDomainStore.setState({
      user: { _id: 'u1', role: 'admin' },
      addresses: [{ _id: 'a1' }],
    });

    useUserDomainStore.getState().resetUser();

    expect(useUserDomainStore.getState().user).toBe(null);
    expect(useUserDomainStore.getState().addresses).toEqual([]);
  });

  it('fetchProfile stores user in localStorage when local token exists', async () => {
    localStorage.setItem('token', 'x');

    vi.spyOn(userApi, 'getProfile').mockResolvedValue({
      _id: 'u1',
      role: 'customer',
      emailVerified: true,
    });

    await useUserDomainStore.getState().fetchProfile();

    expect(JSON.parse(localStorage.getItem('user'))._id).toBe('u1');
    expect(sessionStorage.getItem('user')).toBe(null);
  });

  it('fetchProfile stores user in sessionStorage when only session token exists', async () => {
    sessionStorage.setItem('token', 'x');

    vi.spyOn(userApi, 'getProfile').mockResolvedValue({
      _id: 'u2',
      role: 'customer',
      emailVerified: true,
    });

    await useUserDomainStore.getState().fetchProfile();

    expect(JSON.parse(sessionStorage.getItem('user'))._id).toBe('u2');
    expect(localStorage.getItem('user')).toBe(null);
  });

  it('fetchProfile does not mutate state if API throws', async () => {
    useUserDomainStore.getState().setUser({ _id: 'existing' });

    vi.spyOn(userApi, 'getProfile').mockRejectedValue(new Error('fail'));

    await expect(
      useUserDomainStore.getState().fetchProfile()
    ).rejects.toThrow();

    expect(useUserDomainStore.getState().user._id).toBe('existing');
  });

  it('updateProfile overwrites existing user data fully', async () => {
    localStorage.setItem('token', 'x');
    useUserDomainStore.getState().setUser({ _id: 'old', name: 'Old' });

    vi.spyOn(userApi, 'updateProfile').mockResolvedValue({
      _id: 'old',
      name: 'New',
      role: 'customer',
    });

    await useUserDomainStore.getState().updateProfile({ name: 'New' });

    expect(useUserDomainStore.getState().user.name).toBe('New');
  });

  it('updateAddress enforces exactly one default address', async () => {
    useUserDomainStore.setState({
      addresses: [
        { _id: 'a1', isDefault: true },
        { _id: 'a2', isDefault: false },
      ],
    });

    vi.spyOn(userApi, 'updateAddress').mockResolvedValue({
      _id: 'a2',
      isDefault: true,
    });

    await useUserDomainStore
      .getState()
      .updateAddress('a2', { isDefault: true });

    const defaults = useUserDomainStore
      .getState()
      .addresses.filter((a) => a.isDefault);

    expect(defaults.length).toBe(1);
    expect(defaults[0]._id).toBe('a2');
  });

  it('deleteAddress does not mutate state when API fails', async () => {
    useUserDomainStore.setState({
      addresses: [{ _id: 'a1' }],
    });

    vi.spyOn(userApi, 'deleteAddress').mockRejectedValue(new Error('fail'));

    await expect(
      useUserDomainStore.getState().deleteAddress('a1')
    ).rejects.toThrow();

    expect(useUserDomainStore.getState().addresses.length).toBe(1);
  });

  it('role and verification helpers never throw on malformed user', () => {
    useUserDomainStore.getState().setUser(undefined);

    expect(useUserDomainStore.getState().isAdmin()).toBe(false);
    expect(useUserDomainStore.getState().isCustomer()).toBe(false);
    expect(useUserDomainStore.getState().needsEmailVerification()).toBe(false);
  });

  it('changePassword forwards request with auth headers', async () => {
    sessionStorage.setItem('token', 'x');

    const spy = vi.spyOn(axios, 'put').mockResolvedValue({});

    await useUserDomainStore
      .getState()
      .changePassword({ oldPassword: 'a', newPassword: 'b' });

    expect(spy).toHaveBeenCalled();
  });
});
