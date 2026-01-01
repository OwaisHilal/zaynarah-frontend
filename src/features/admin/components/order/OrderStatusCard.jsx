// src/features/admin/components/order/OrderStatusCard.jsx

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function OrderStatusCard({
  order,
  allowedTransitions = [],
  onUpdate,
  updating,
}) {
  const [nextStatus, setNextStatus] = useState('');
  const [note, setNote] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [carrier, setCarrier] = useState('');

  useEffect(() => {
    setTrackingId(order.fulfillment?.trackingId || '');
    setCarrier(order.fulfillment?.carrier || '');
  }, [order]);

  const requiresFulfillment =
    nextStatus === 'shipped' || nextStatus === 'delivered';

  const canSubmit =
    Boolean(nextStatus) &&
    (!requiresFulfillment || Boolean(trackingId || carrier));

  const handleSubmit = async () => {
    await onUpdate(nextStatus, {
      note: note || undefined,
      fulfillment:
        requiresFulfillment && (trackingId || carrier)
          ? { trackingId, carrier }
          : undefined,
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

  if (allowedTransitions.length === 0) {
    return (
      <Card className="border border-slate-200 bg-white p-6">
        <div className="text-sm text-slate-600">
          No further status changes are available for this order.
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 bg-white p-6">
      <div className="text-sm font-medium text-slate-900 mb-4">
        Change order status
      </div>

      <div className="flex flex-col gap-3">
        <select
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
          className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Select next status</option>
          {allowedTransitions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {requiresFulfillment && (
          <div className="grid grid-cols-1 gap-2">
            <Input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Tracking ID"
            />
            <Input
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="Carrier (e.g. Delhivery, Blue Dart)"
            />
          </div>
        )}

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note (visible in timeline)"
          className="border border-slate-200 rounded-md px-3 py-2 text-sm resize-none"
          rows={3}
        />

        <div className="flex justify-end">
          <Button disabled={!canSubmit || updating} onClick={handleSubmit}>
            {updating ? 'Updating…' : 'Confirm'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
