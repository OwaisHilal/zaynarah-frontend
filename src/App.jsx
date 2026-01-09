// src/App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import { useAuthStore } from '@/stores/user';
import { useCartDomainStore } from '@/stores/cart';
import { useCheckoutDomainStore, useCheckoutUIStore } from '@/stores/checkout';

import useNotificationsSSE from '@/features/notifications/hooks/useNotificationsSSE';

import AdminRoutes from './routes/admin/AdminRoutes';
import StorefrontRoutes from './routes/storefront/StorefrontRoutes';

export default function App() {
  const hydrateSession = useAuthStore((s) => s.hydrateSession);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const hydrateCart = useCartDomainStore((s) => s.hydrate);
  const mergeOnLogin = useCartDomainStore((s) => s.mergeOnLogin);
  const resetToGuest = useCartDomainStore((s) => s.resetToGuest);

  const hydrateCheckout = useCheckoutDomainStore((s) => s.hydrate);
  const resetCheckoutDomain = useCheckoutDomainStore((s) => s.reset);
  const resetCheckoutUI = useCheckoutUIStore((s) => s.reset);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (!authHydrated) return;
    hydrateCart();
    hydrateCheckout();
  }, [authHydrated, hydrateCart, hydrateCheckout]);

  useEffect(() => {
    if (!authHydrated) return;

    if (isAuthenticated) {
      mergeOnLogin();
    } else {
      resetToGuest();
      resetCheckoutDomain();
      resetCheckoutUI();
    }
  }, [
    authHydrated,
    isAuthenticated,
    mergeOnLogin,
    resetToGuest,
    resetCheckoutDomain,
    resetCheckoutUI,
  ]);

  useNotificationsSSE();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<StorefrontRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}
