// src/App.jsx
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { CartProvider } from './features/cart/context/CartContext';
import SearchProvider from '@/features/search/context/SearchProvider';

import CartPage from './features/cart/pages/CartPage';
import ProductPage from './features/products/pages/ProductPage';
import Home from './pages/Home';
import ShopPage from './features/products/pages/ShopPage';
import Layout from './features/ui/Layout';

import LoginPage from './features/user/pages/LoginPage';
import SignupPage from './features/user/pages/SignupPage';
import ProfilePage from './features/user/pages/ProfilePage';
import VerifyEmailPage from './features/user/pages/VerifyEmailPage';

import { useUserStore } from './features/user/hooks/useUser';
import CheckoutPage from './features/checkout/pages/CheckoutPage';
import OrderSuccessPage from './features/checkout/pages/OrderSuccess';
import TheCraftPage from './pages/TheCraft';

import SearchModal from '@/features/search/components/SearchModal';
import { ToastProvider } from '@/features/ui/toast';

/* =========================
   ROUTE GUARDS
========================= */

function ProtectedRoute({ children }) {
  const { user } = useUserStore();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function VerifiedRoute({ children }) {
  const { user } = useUserStore();

  if (!user) return <Navigate to="/login" replace />;
  if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  return children;
}

/* =========================
   APP
========================= */

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <SearchProvider>
            <SearchModal />

            <Routes>
              <Route element={<Layout />}>
                {/* -------------------------
                   PUBLIC ROUTES
                ------------------------- */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/the-craft" element={<TheCraftPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Email Verification (PUBLIC) */}
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* -------------------------
                   AUTHENTICATED ROUTES
                ------------------------- */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* -------------------------
                   VERIFIED USER ROUTES
                ------------------------- */}
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
      </CartProvider>
    </BrowserRouter>
  );
}
