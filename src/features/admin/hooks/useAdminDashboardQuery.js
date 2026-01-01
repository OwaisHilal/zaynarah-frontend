// src/features/admin/hooks/useAdminDashboardQuery.js

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function fetchAdminDashboard() {
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [summaryRes, trendRes, paymentsRes, stockRes] = await Promise.all([
    fetch(`${API_BASE}/admin/analytics/summary`, { headers }),
    fetch(`${API_BASE}/admin/analytics/orders-trend`, { headers }),
    fetch(`${API_BASE}/admin/analytics/payments-breakdown`, { headers }),
    fetch(`${API_BASE}/admin/analytics/low-stock`, { headers }),
  ]);

  if (!summaryRes.ok || !trendRes.ok || !paymentsRes.ok || !stockRes.ok) {
    throw new Error('Admin dashboard fetch failed');
  }

  const [summary, ordersTrend, paymentsBreakdown, lowStock] = await Promise.all(
    [summaryRes.json(), trendRes.json(), paymentsRes.json(), stockRes.json()]
  );

  return {
    summary,
    ordersTrend,
    paymentsBreakdown,
    lowStock,
  };
}

export function useAdminDashboardQuery() {
  return {
    queryKey: ['admin', 'dashboard'],
    queryFn: fetchAdminDashboard,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  };
}
