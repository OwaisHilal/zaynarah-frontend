// frontend/src/features/user/hooks/useUser.js
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/user/auth.store';
import { useUserDomainStore } from '@/stores/user/user.store';

export const useUserStore = () => {
  const auth = useAuthStore();
  const userDomain = useUserDomainStore();

  return {
    user: userDomain.user,
    addresses: userDomain.addresses,

    loading: auth.loading,
    error: auth.error,

    needsEmailVerification: userDomain.needsEmailVerification(),

    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,

    fetchProfile: userDomain.fetchProfile,
    updateProfile: userDomain.updateProfile,
    changePassword: userDomain.changePassword,

    fetchAddresses: userDomain.fetchAddresses,
    addAddress: userDomain.addAddress,
    updateAddress: userDomain.updateAddress,
    deleteAddress: userDomain.deleteAddress,

    resendEmailVerification: async () => {
      try {
        await userDomain.resendEmailVerification();
        return true;
      } catch {
        return false;
      }
    },

    isAdmin: userDomain.isAdmin,
    isCustomer: userDomain.isCustomer,
  };
};
