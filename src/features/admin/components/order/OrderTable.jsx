// src/features/admin/components/order/OrderTable.jsx

import { Button } from '@/components/ui/button';
import { Pill } from '../Pill';
import { useMemo } from 'react';

export function OrderTableRow({ order, onView }) {
  const { _id, user, totalAmount, paymentStatus, status, createdAt } =
    order || {};

  const orderId = _id ? _id.slice(-6) : '—';

  const paymentTone = useMemo(
    () =>
      ({
        paid: 'success',
        failed: 'danger',
        pending: 'warning',
      }[paymentStatus] || 'neutral'),
    [paymentStatus]
  );

  const statusTone = useMemo(
    () =>
      ({
        delivered: 'success',
        shipped: 'info',
        processing: 'warning',
      }[status] || 'neutral'),
    [status]
  );

  const createdDate = useMemo(() => {
    const d = new Date(createdAt);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
  }, [createdAt]);

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-900">#{orderId}</td>
      <td className="px-6 py-4 text-slate-700">{user?.email || 'Guest'}</td>
      <td className="px-6 py-4 font-medium text-slate-900">
        ₹{totalAmount ?? 0}
      </td>
      <td className="px-6 py-4">
        <Pill tone={paymentTone}>{paymentStatus || 'unknown'}</Pill>
      </td>
      <td className="px-6 py-4">
        <Pill tone={statusTone}>{status || 'unknown'}</Pill>
      </td>
      <td className="px-6 py-4 text-slate-500">{createdDate}</td>
      <td className="px-6 py-4 text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => _id && onView(_id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View
        </Button>
      </td>
    </tr>
  );
}

export function OrderSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: 7 }).map((_, j) => (
        <td key={j} className="px-6 py-4">
          <div className="h-4 w-full rounded bg-slate-100" />
        </td>
      ))}
    </tr>
  ));
}
