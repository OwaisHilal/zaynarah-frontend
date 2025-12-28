import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function OrderFulfillmentCard({ order, onSave, updating }) {
  const [carrier, setCarrier] = useState(order.fulfillment?.carrier || '');
  const [trackingId, setTrackingId] = useState(
    order.fulfillment?.trackingId || ''
  );

  if (order.status !== 'shipped' && order.status !== 'delivered') return null;

  return (
    <Card className="border border-slate-200 bg-white p-6">
      <div className="text-sm font-medium text-slate-900 mb-4">Fulfillment</div>

      <div className="flex flex-col gap-3 text-sm">
        <input
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          placeholder="Carrier (e.g. BlueDart)"
          className="border border-slate-200 rounded-md px-3 py-2"
        />

        <input
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Tracking ID"
          className="border border-slate-200 rounded-md px-3 py-2"
        />

        <div className="flex justify-end">
          <Button
            disabled={!carrier || !trackingId || updating}
            onClick={() => onSave({ carrier, trackingId })}
          >
            Save tracking
          </Button>
        </div>
      </div>
    </Card>
  );
}
