// frontend/src/App.jsx
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { CartProvider } from './features/cart/context/CartContext';
import SearchProvider from '@/features/search/context/SearchProvider';
import { ToastProvider } from '@/features/ui/toast';

import Layout from './features/ui/Layout';

import Home from './pages/Home';
import ShopPage from './features/products/pages/ShopPage';
import ProductPage from './features/products/pages/ProductPage';
import CartPage from './features/cart/pages/CartPage';
import CheckoutPage from './features/checkout/pages/CheckoutPage';
import OrderSuccessPage from './features/checkout/pages/OrderSuccess';
import TheCraftPage from './pages/TheCraft';

import LoginPage from './features/user/pages/LoginPage';
import SignupPage from './features/user/pages/SignupPage';
import ProfilePage from './features/user/pages/ProfilePage';
import VerifyEmailPage from './features/user/pages/VerifyEmailPage';

import SearchModal from '@/features/search/components/SearchModal';

import { useUserStore } from './features/user/hooks/useUser';
import AdminRoutes from './features/admin/routes/AdminRoutes';
import useNotificationsSSE from './features/notifications/hooks/useNotificationsSSE';

function ProtectedRoute({ children }) {
  const { user } = useUserStore();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function VerifiedRoute({ children }) {
  const { user } = useUserStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return (
      <Navigate
        to={`/verify-email?from=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}

function StorefrontApp() {
  return (
    <CartProvider>
      <ToastProvider>
        <SearchProvider>
          <SearchModal />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/the-craft" element={<TheCraftPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
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
    </CartProvider>
  );
}

function AdminApp() {
  return <AdminRoutes />;
}

export default function App() {
  useNotificationsSSE();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<StorefrontApp />} />
      </Routes>
    </BrowserRouter>
  );
}
