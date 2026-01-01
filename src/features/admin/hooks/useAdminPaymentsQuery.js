// src/features/admin/hooks/useAdminPaymentsQuery.js

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function fetchAdminPayments({ page, status, provider }) {
  const token = localStorage.getItem('token');

  const params = new URLSearchParams({ page });

  if (status) params.append('status', status);
  if (provider) params.append('provider', provider);

  const res = await fetch(`${API_BASE}/admin/payments?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch payments');
  }

  return res.json();
}

export function useAdminPaymentsQuery(filters) {
  return {
    queryKey: ['admin', 'payments', filters],
    queryFn: () => fetchAdminPayments(filters),
    keepPreviousData: true,
    staleTime: 1000 * 30,
    retry: 1,
  };
}
