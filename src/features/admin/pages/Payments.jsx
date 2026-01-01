// src/features/admin/pages/Payments.jsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaymentsTable } from '../components/payments/PaymentsTable';
import { PaymentsFilters } from '../components/payments/PaymentsFilters';
import { Pagination } from '../components/Pagination';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const fetchPayments = async ({ queryKey }) => {
  const [, { page, status, provider }] = queryKey;

  const res = await fetch(
    `${API_BASE}/admin/payments?` +
      new URLSearchParams({
        page,
        ...(status ? { status } : {}),
        ...(provider ? { provider } : {}),
      }),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch payments');

  return res.json();
};

export default function Payments() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [provider, setProvider] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', { page, status, provider }],
    queryFn: fetchPayments,
    keepPreviousData: true,
  });

  const payments = data?.data || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-neutral-500 italic">
        Loading payments…
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PaymentsFilters
        status={status}
        provider={provider}
        onStatusChange={(v) => {
          setPage(1);
          setStatus(v);
        }}
        onProviderChange={(v) => {
          setPage(1);
          setProvider(v);
        }}
      />

      <PaymentsTable payments={payments} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
