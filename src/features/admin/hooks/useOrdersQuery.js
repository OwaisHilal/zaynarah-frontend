// src/features/admin/hooks/useOrdersQuery.js

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const PAGE_SIZE = 20;

async function fetchOrders({ page, status, paymentStatus, from, to }) {
  const token = localStorage.getItem('token');

  const params = new URLSearchParams({
    page,
    limit: PAGE_SIZE,
  });

  if (status) params.append('status', status);
  if (paymentStatus) params.append('paymentStatus', paymentStatus);
  if (from) params.append('from', from);
  if (to) params.append('to', to);

  const res = await fetch(`${API_BASE}/orders?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch orders');
  }

  const data = await res.json();

  return {
    orders: Array.isArray(data) ? data : [],
    hasMore: Array.isArray(data) && data.length === PAGE_SIZE,
  };
}

export function useOrdersQuery(filters) {
  return {
    queryKey: ['admin', 'orders', filters],
    queryFn: () => fetchOrders(filters),
    keepPreviousData: true,
    staleTime: 1000 * 30,
    retry: 1,
  };
}
