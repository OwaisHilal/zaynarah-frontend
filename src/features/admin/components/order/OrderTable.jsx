// src/features/admin/components/order/OrderTable.jsx
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Pill } from '../Pill';
import {
  Eye,
  ExternalLink,
  User,
  Calendar,
  CreditCard,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function OrderTableRow({ order, onView }) {
  const { _id, user, totalAmount, paymentStatus, status, createdAt } =
    order || {};
  const orderId = _id ? _id.slice(-6).toUpperCase() : '—';

  const paymentTone = useMemo(
    () =>
      ({ paid: 'success', failed: 'danger', pending: 'warning' }[
        paymentStatus
      ] || 'neutral'),
    [paymentStatus]
  );

  const statusTone = useMemo(
    () =>
      ({ delivered: 'success', shipped: 'info', processing: 'warning' }[
        status
      ] || 'neutral'),
    [status]
  );

  const createdDate = useMemo(() => {
    const d = new Date(createdAt);
    return Number.isNaN(d.getTime())
      ? '—'
      : d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
  }, [createdAt]);

  return (
    <tr className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-all duration-200">
      {' '}
      <td className="px-6 py-4">
        {' '}
        <div className="flex flex-col">
          {' '}
          <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md w-fit">
            {' '}
            #{orderId}{' '}
          </span>{' '}
        </div>{' '}
      </td>{' '}
      <td className="px-6 py-4">
        {' '}
        <div className="flex items-center gap-3">
          {' '}
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            {' '}
            <User size={14} />{' '}
          </div>{' '}
          <div className="flex flex-col min-w-0">
            {' '}
            <span className="text-sm font-bold text-slate-900 truncate">
              {' '}
              {user?.name || 'Guest User'}{' '}
            </span>{' '}
            <span className="text-[11px] font-medium text-slate-500 truncate lowercase">
              {' '}
              {user?.email || 'No email provided'}{' '}
            </span>{' '}
          </div>{' '}
        </div>{' '}
      </td>{' '}
      <td className="px-6 py-4">
        {' '}
        <div className="flex flex-col">
          {' '}
          <span className="text-sm font-black text-slate-900">
            {' '}
            ₹{totalAmount?.toLocaleString() ?? 0}{' '}
          </span>{' '}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {' '}
            Total Gross{' '}
          </span>{' '}
        </div>{' '}
      </td>{' '}
      <td className="px-6 py-4">
        {' '}
        <div className="flex flex-col gap-1.5">
          {' '}
          <Pill
            tone={paymentTone}
            className="w-fit text-[10px] font-black uppercase px-2 py-0"
          >
            {' '}
            {paymentStatus || 'unknown'}{' '}
          </Pill>{' '}
        </div>{' '}
      </td>{' '}
      <td className="px-6 py-4">
        {' '}
        <div className="flex flex-col gap-1.5">
          {' '}
          <Pill
            tone={statusTone}
            className="w-fit text-[10px] font-black uppercase px-2 py-0"
          >
            {' '}
            {status || 'unknown'}{' '}
          </Pill>{' '}
        </div>{' '}
      </td>{' '}
      <td className="px-6 py-4">
        {' '}
        <div className="flex items-center gap-2 text-slate-500">
          {' '}
          <Calendar size={13} className="text-slate-300" />{' '}
          <span className="text-xs font-semibold">{createdDate}</span>{' '}
        </div>{' '}
      </td>{' '}
      <td className="px-6 py-4 text-right">
        {' '}
        <Button
          variant="outline"
          size="sm"
          onClick={() => _id && onView(_id)}
          className="h-8 w-8 p-0 rounded-lg border-slate-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm"
        >
          {' '}
          <Eye size={14} />{' '}
        </Button>{' '}
      </td>{' '}
    </tr>
  );
}

export function OrderSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => (
    <tr key={i} className="border-b border-slate-50 animate-pulse">
      {' '}
      <td className="px-6 py-5">
        <div className="h-6 w-16 bg-slate-100 rounded-lg" />
      </td>{' '}
      <td className="px-6 py-5">
        {' '}
        <div className="flex items-center gap-3">
          {' '}
          <div className="h-8 w-8 rounded-full bg-slate-100" />{' '}
          <div className="space-y-2">
            {' '}
            <div className="h-3 w-24 bg-slate-100 rounded" />{' '}
            <div className="h-2 w-32 bg-slate-50 rounded" />{' '}
          </div>{' '}
        </div>{' '}
      </td>{' '}
      <td className="px-6 py-5">
        <div className="h-4 w-20 bg-slate-100 rounded" />
      </td>{' '}
      <td className="px-6 py-5">
        <div className="h-5 w-16 bg-slate-100 rounded-full" />
      </td>{' '}
      <td className="px-6 py-5">
        <div className="h-5 w-20 bg-slate-100 rounded-full" />
      </td>{' '}
      <td className="px-6 py-5">
        <div className="h-4 w-24 bg-slate-100 rounded" />
      </td>{' '}
      <td className="px-6 py-5 text-right">
        <div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto" />
      </td>{' '}
    </tr>
  ));
}
