import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function OrderStatusCard({
  order,
  allowedTransitions,
  onUpdate,
  updating,
}) {
  const [nextStatus, setNextStatus] = useState('');
  const [note, setNote] = useState('');
  const [trackingId, setTrackingId] = useState(
    order.fulfillment?.trackingId || ''
  );
  const [carrier, setCarrier] = useState(order.fulfillment?.carrier || '');

  const handleSubmit = async () => {
    await onUpdate(nextStatus, {
      note,
      fulfillment: trackingId || carrier ? { trackingId, carrier } : undefined,
    });
    setNextStatus('');
    setNote('');
  };

  if (order.status === 'cancelled') {
    return (
      <Card className="border border-slate-200 bg-slate-50 p-6">
        <div className="text-sm font-medium text-slate-900">
          Order is cancelled
        </div>
        <p className="text-sm text-slate-600 mt-1">
          This order is in a final state and can no longer be modified.
        </p>
      </Card>
    );
  }

  if (allowedTransitions.length === 0) return null;

  const showFulfillment = order.status === 'paid' || order.status === 'shipped';

  return (
    <Card className="border border-slate-200 bg-white p-6">
      <div className="text-sm font-medium text-slate-900 mb-4">
        Change order status
      </div>

      <div className="flex flex-col gap-3">
        <select
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm"
        >
          <option value="">Select status</option>
          {allowedTransitions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {showFulfillment && (
          <>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Tracking ID"
              className="border border-slate-200 rounded-md px-3 py-2 text-sm"
            />

            <input
              type="text"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="Carrier (e.g. Delhivery, Blue Dart)"
              className="border border-slate-200 rounded-md px-3 py-2 text-sm"
            />
          </>
        )}

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note (visible in timeline)"
          className="border border-slate-200 rounded-md px-3 py-2 text-sm resize-none"
          rows={3}
        />

        <div className="flex justify-end">
          <Button disabled={!nextStatus || updating} onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </div>
    </Card>
  );
}
