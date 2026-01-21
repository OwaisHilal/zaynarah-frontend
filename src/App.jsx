// src/App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import { useAuthStore, useUserDomainStore } from '@/stores/user';
import { useCartDomainStore } from '@/stores/cart';
import { useCheckoutDomainStore, useCheckoutUIStore } from '@/stores/checkout';
import { useWishlistDomainStore } from '@/stores/wishlist';

import useNotificationsSSE from '@/features/notifications/hooks/useNotificationsSSE';

import AdminRoutes from './routes/admin/AdminRoutes';
import StorefrontRoutes from './routes/storefront/StorefrontRoutes';

export default function App() {
  const hydrateSession = useAuthStore((s) => s.hydrateSession);
  const authHydrated = useAuthStore((s) => s.hydrated);

  const user = useUserDomainStore((s) => s.user);
  const isAuthenticated = !!user;

  const hydrateCart = useCartDomainStore((s) => s.hydrate);
  const mergeCartOnLogin = useCartDomainStore((s) => s.mergeOnLogin);
  const resetCartToGuest = useCartDomainStore((s) => s.resetToGuest);

  const hydrateCheckout = useCheckoutDomainStore((s) => s.hydrate);
  const resetCheckoutDomain = useCheckoutDomainStore((s) => s.reset);
  const checkoutSessionId = useCheckoutDomainStore((s) => s.checkoutSessionId);

  const resetCheckoutUI = useCheckoutUIStore((s) => s.reset);

  const hydrateWishlist = useWishlistDomainStore((s) => s.hydrate);
  const mergeWishlistOnLogin = useWishlistDomainStore((s) => s.mergeOnLogin);
  const resetWishlistToGuest = useWishlistDomainStore((s) => s.resetToGuest);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (!authHydrated) return;
    hydrateCart();
    hydrateCheckout();
    hydrateWishlist();
  }, [authHydrated, hydrateCart, hydrateCheckout, hydrateWishlist]);

  useEffect(() => {
    if (!authHydrated) return;

    if (checkoutSessionId) return;

    if (isAuthenticated) {
      mergeCartOnLogin();
      mergeWishlistOnLogin();
      return;
    }

    resetCartToGuest();
    resetWishlistToGuest();
    resetCheckoutDomain();
    resetCheckoutUI();
  }, [
    authHydrated,
    isAuthenticated,
    checkoutSessionId,
    mergeCartOnLogin,
    mergeWishlistOnLogin,
    resetCartToGuest,
    resetWishlistToGuest,
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
