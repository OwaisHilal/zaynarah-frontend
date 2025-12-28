import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { PaymentsTable } from '../components/payments/PaymentsTable';
import { PaymentsFilters } from '../components/payments/PaymentsFilters';
import { Pagination } from '../components/Pagination';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState('');
  const [provider, setProvider] = useState('');

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/admin/payments`, {
        params: {
          page,
          ...(status ? { status } : {}),
          ...(provider ? { provider } : {}),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setPayments(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setPayments([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, status, provider]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  if (loading) {
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
