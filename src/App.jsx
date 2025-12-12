// src/App.jsx
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { CartProvider } from './features/cart/context/CartContext';

import CartPage from './features/cart/pages/CartPage';
import ProductPage from './features/products/pages/ProductPage';
import Home from './pages/Home';
import ShopPage from './features/products/pages/ShopPage';
import Layout from './features/ui/Layout';

import LoginPage from './features/user/pages/LoginPage';
import SignupPage from './features/user/pages/SignupPage';
import ProfilePage from './features/user/pages/ProfilePage';

import { useUserStore } from './features/user/hooks/useUser';
import CheckoutPage from './features/checkout/pages/CheckoutPage';
import OrderSuccessPage from './features/checkout/pages/OrderSuccess';
import TheCraftPage from './pages/TheCraft';

function ProtectedRoute({ children }) {
  const { user } = useUserStore();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/the-craft" element={<TheCraftPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
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
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout/success"
              element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
