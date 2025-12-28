import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import useAdminGuard from '../hooks/useAdminGuard';

import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import Products from '../pages/Products';

function AdminUsers() {
  return <div />;
}

function AdminPayments() {
  return <div />;
}

export default function AdminRoutes() {
  const { allowed, loading } = useAdminGuard();

  if (loading || !allowed) return null;

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />

        <Route path="products" element={<Products />} />

        <Route path="users" element={<AdminUsers />} />
        <Route path="payments" element={<AdminPayments />} />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
