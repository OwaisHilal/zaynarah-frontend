// src/routes/storefront/StorefrontRoutes.jsx
import CartPage from '@/features/cart/pages/CartPage';
import CheckoutPage from '@/features/checkout/pages/CheckoutPage';
import OrderSuccessPage from '@/features/checkout/pages/OrderSuccess';
import NotificationsPage from '@/features/notifications/pages/NotificationsPage';
import OrdersPage from '@/features/orders/pages/OrdersPage';
import ProductPage from '@/features/products/pages/ProductPage';
import WishlistPage from '@/features/wishlist/pages/WishlistPage';
import ShopPage from '@/pages/ShopPage';
import SearchModal from '@/features/search/components/SearchModal';
import SearchProvider from '@/features/search/context/SearchProvider';
import Layout from '@/features/ui/Layout';
import { ToastProvider } from '@/features/ui/toast';
import ForgotPasswordPage from '@/features/user/pages/ForgotPasswordPage';
import LoginPage from '@/features/user/pages/LoginPage';
import ProfilePage from '@/features/user/pages/ProfilePage';
import ResetPasswordPage from '@/features/user/pages/ResetPasswordPage';
import SignupPage from '@/features/user/pages/SignupPage';
import VerifyEmailPage from '@/features/user/pages/VerifyEmailPage';
import Home from '@/pages/Home';
import TheCraftPage from '@/pages/TheCraft';
import { useAuthStore, useUserDomainStore } from '@/stores/user';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

function AuthBlockingShell() {
  console.log('[AuthBlockingShell] rendering');
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-sm text-muted-foreground">
      Loading…
    </div>
  );
}

function ProtectedRoute({ children }) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  console.log('[ProtectedRoute] render', {
    hydrated,
    isAuthenticated,
    path: location.pathname,
  });

  if (!hydrated) {
    console.log('[ProtectedRoute] blocked: not hydrated');
    return <AuthBlockingShell />;
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] redirecting to /login', {
      from: location.pathname,
    });
    return (
      <Navigate
        to={`/login?from=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  console.log('[ProtectedRoute] allowed', location.pathname);
  return children;
}

function VerifiedRoute({ children }) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const needsEmailVerification = useUserDomainStore((s) =>
    s.needsEmailVerification(),
  );
  const location = useLocation();

  console.log('[VerifiedRoute] render', {
    hydrated,
    isAuthenticated,
    needsEmailVerification,
    path: location.pathname,
  });

  if (!hydrated) {
    console.log('[VerifiedRoute] blocked: not hydrated');
    return <AuthBlockingShell />;
  }

  if (!isAuthenticated) {
    console.log('[VerifiedRoute] redirecting to /login', {
      from: location.pathname,
    });
    return (
      <Navigate
        to={`/login?from=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (needsEmailVerification) {
    console.log('[VerifiedRoute] redirecting to /verify-email', {
      from: location.pathname,
    });
    return (
      <Navigate
        to={`/verify-email?from=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  console.log('[VerifiedRoute] allowed', location.pathname);
  return children;
}

export default function StorefrontRoutes() {
  console.log('[StorefrontRoutes] render');

  return (
    <ToastProvider>
      <SearchProvider>
        <SearchModal />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/the-craft" element={<TheCraftPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <VerifiedRoute>
                  <CheckoutPage />
                </VerifiedRoute>
              }
            />

            <Route
              path="/checkout/success"
              element={
                <VerifiedRoute>
                  <OrderSuccessPage />
                </VerifiedRoute>
              }
            />
          </Route>
        </Routes>
      </SearchProvider>
    </ToastProvider>
  );
}
