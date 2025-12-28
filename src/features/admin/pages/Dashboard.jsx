// frontend/src/features/admin/pages/Dashboard.jsx
import { Card } from '@/components/ui/card';

function Metric({ label, value }) {
  return (
    <Card className="border border-neutral-200 bg-white p-5">
      <div className="text-xs font-medium tracking-wide text-neutral-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-neutral-900">
        {value}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500">Store performance overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Revenue" value="—" />
        <Metric label="Orders" value="—" />
        <Metric label="Customers" value="—" />
        <Metric label="Products" value="—" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border border-neutral-200 bg-white p-6 h-64">
          <div className="text-sm font-medium text-neutral-800">
            Revenue trend
          </div>
          <div className="mt-4 text-sm text-neutral-500">
            Analytics will appear once data is connected
          </div>
        </Card>

        <Card className="border border-neutral-200 bg-white p-6 h-64">
          <div className="text-sm font-medium text-neutral-800">
            Order volume
          </div>
          <div className="mt-4 text-sm text-neutral-500">
            Analytics will appear once data is connected
          </div>
        </Card>
      </div>
    </div>
  );
}
