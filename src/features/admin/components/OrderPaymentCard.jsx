import { Card } from '@/components/ui/card';
import { Pill } from './Pill';

export function OrderPaymentCard({ order }) {
  const refundEligible =
    order.paymentStatus === 'paid' && order.status !== 'cancelled';

  const hasFulfillment =
    order.fulfillment &&
    (order.fulfillment.trackingId || order.fulfillment.carrier);

  return (
    <div className="flex flex-col gap-6">
      <Card className="border border-slate-200 bg-white p-6">
        <div className="text-sm font-medium text-slate-900 mb-4">Payment</div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <Pill
              tone={
                order.paymentStatus === 'paid'
                  ? 'success'
                  : order.paymentStatus === 'failed'
                  ? 'danger'
                  : 'warning'
              }
            >
              {order.paymentStatus}
            </Pill>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Provider</span>
            <span className="text-slate-900">
              {order.paymentProvider || '—'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Payment ID</span>
            <span className="text-slate-900 truncate max-w-[140px]">
              {order.paymentIntentId || '—'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Paid at</span>
            <span className="text-slate-900">
              {order.paidAt ? new Date(order.paidAt).toLocaleString() : '—'}
            </span>
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
                {order.fulfillment.carrier || '—'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Tracking ID</span>
              <span className="text-slate-900 truncate max-w-[160px]">
                {order.fulfillment.trackingId || '—'}
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
