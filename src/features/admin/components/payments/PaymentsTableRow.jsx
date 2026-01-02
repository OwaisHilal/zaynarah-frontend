// src/features/admin/components/payments/PaymentsTableRow.jsx

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExternalLink, User } from 'lucide-react';

export function PaymentsTableRow({ payment }) {
  const orderId = payment?.orderId || payment?._id || '—';
  const email = payment?.user?.email || 'Guest';
  const name = payment?.user?.name || 'Anonymous';

  const amount =
    typeof payment?.amount === 'number'
      ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: payment?.currency || 'INR',
          maximumFractionDigits: 0,
        }).format(payment.amount)
      : '—';

  const provider = payment?.paymentProvider || 'manual';
  const status = payment?.paymentStatus || 'pending';
  const paidAt = payment?.paidAt
    ? new Date(payment.paidAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const statusConfig = {
    paid: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20',
    failed: 'bg-rose-500/10 text-rose-600 ring-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',
    refunded: 'bg-slate-500/10 text-slate-600 ring-slate-500/20',
  };

  return (
    <tr className="group hover:bg-slate-50/80 transition-all duration-200">
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
            #{orderId.toString().slice(-8).toUpperCase()}
          </span>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600">
            <ExternalLink size={14} />
          </button>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <User size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900 leading-none mb-1">
              {name}
            </span>
            <span className="text-[10px] font-medium text-slate-400 leading-none">
              {email}
            </span>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <span className="text-sm font-black text-slate-900 tracking-tight">
          {amount}
        </span>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              provider === 'stripe' ? 'bg-indigo-500' : 'bg-blue-500'
            )}
          />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            {provider}
          </span>
        </div>
      </td>

      <td className="px-6 py-5">
        <Badge
          className={cn(
            'shadow-none border-none ring-1 ring-inset px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
            statusConfig[status] || statusConfig.pending
          )}
        >
          {status}
        </Badge>
      </td>

      <td className="px-6 py-5 text-right">
        <span className="text-[11px] font-bold text-slate-400 tabular-nums">
          {paidAt}
        </span>
      </td>
    </tr>
  );
}
