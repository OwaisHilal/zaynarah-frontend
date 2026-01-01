// src/features/admin/hooks/useOrderDetailsQuery.js

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function fetchOrderById(id) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Order fetch failed');
  }

  return res.json();
}

async function updateOrderStatus({ orderId, status, note }) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, note }),
  });

  if (!res.ok) {
    throw new Error('Order status update failed');
  }

  return res.json();
}

export function useOrderDetailsQuery(id) {
  return {
    queryKey: ['admin', 'order', id],
    queryFn: () => fetchOrderById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 30,
    retry: 1,
  };
}

export function useOrderStatusMutation() {
  return {
    mutationFn: updateOrderStatus,
  };
}
