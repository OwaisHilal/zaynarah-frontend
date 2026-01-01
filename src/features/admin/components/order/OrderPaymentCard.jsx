// src/features/admin/components/order/OrderPaymentCard.jsx

import { Card } from '@/components/ui/card';
import { Pill } from '../Pill';
import { useMemo } from 'react';

export function OrderPaymentCard({ order }) {
  const {
    paymentStatus,
    paymentProvider,
    paymentIntentId,
    paidAt,
    status,
    fulfillment,
  } = order || {};

  const paymentTone = useMemo(
    () =>
      ({
        paid: 'success',
        failed: 'danger',
        pending: 'warning',
      }[paymentStatus] || 'neutral'),
    [paymentStatus]
  );

  const refundEligible =
    paymentStatus === 'paid' &&
    status !== 'cancelled' &&
    status !== 'delivered';

  const hasFulfillment = Boolean(
    fulfillment?.carrier || fulfillment?.trackingId
  );

  const paidAtLabel = useMemo(() => {
    if (!paidAt) return '—';
    const d = new Date(paidAt);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
  }, [paidAt]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-slate-200 bg-white p-6">
        <div className="text-sm font-medium text-slate-900 mb-4">Payment</div>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status</span>
            <Pill tone={paymentTone}>{paymentStatus || 'unknown'}</Pill>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Provider</span>
            <span className="text-slate-900">{paymentProvider || '—'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Payment ID</span>
            <span className="text-slate-900 truncate max-w-[160px]">
              {paymentIntentId || '—'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Paid at</span>
            <span className="text-slate-900">{paidAtLabel}</span>
          </div>
        </div>
      </Card>

      {hasFulfillment && (
        <Card className="border border-slate-200 bg-white p-6">
          <div className="text-sm font-medium text-slate-900 mb-4">
            Fulfillment
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Carrier</span>
              <span className="text-slate-900">
                {fulfillment?.carrier || '—'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Tracking ID</span>
              <span className="text-slate-900 truncate max-w-[160px]">
                {fulfillment?.trackingId || '—'}
              </span>
            </div>
          </div>
        </Card>
      )}

      <Card className="border border-slate-200 bg-slate-50 p-6">
        <div className="text-sm font-medium text-slate-900 mb-2">Refunds</div>
        <p className="text-sm text-slate-600">
          {refundEligible
            ? 'This order is eligible for a refund. Refund actions will be enabled in a future update.'
            : 'This order is not eligible for a refund.'}
        </p>
      </Card>
    </div>
  );
}
