import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/user';
import { useCartDomainStore } from '@/stores/cart';
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

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (!authHydrated) return;
    hydrateCart();
  }, [authHydrated, hydrateCart]);

  useEffect(() => {
    if (!authHydrated) return;
    if (isAuthenticated) mergeOnLogin();
    else resetToGuest();
  }, [authHydrated, isAuthenticated, mergeOnLogin, resetToGuest]);

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
