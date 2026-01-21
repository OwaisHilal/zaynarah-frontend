//src\features\admin\routes\AdminRoutes.jsx
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import useAdminGuard from '../hooks/useAdminGuard';

import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import Products from '../pages/Products';
import Users from '../pages/Users';
import Payments from '../pages/Payments';
import AdminSettings from '../pages/Settings';

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

        <Route path="users" element={<Users />} />
        <Route path="payments" element={<Payments />} />

        <Route path="settings" element={<AdminSettings />} />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
