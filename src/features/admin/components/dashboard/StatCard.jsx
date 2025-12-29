import { Card } from '@/components/ui/card';

export function StatCard({ label, value, description }) {
  return (
    <Card className="border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-neutral-900">{value}</span>
        {description && (
          <span className="text-xs text-neutral-400">{description}</span>
        )}
      </div>
    </Card>
  );
}
