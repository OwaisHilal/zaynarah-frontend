// src/features/admin/components/dashboard/PaymentsBreakdownCharts.jsx

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useMemo } from 'react';

const PROVIDER_COLORS = {
  stripe: '#6366f1',
  razorpay: '#22c55e',
  unknown: '#94a3b8',
};

const STATUS_COLORS = {
  paid: '#16a34a',
  pending: '#f59e0b',
  failed: '#dc2626',
  unknown: '#94a3b8',
};

function normalize(data, key) {
  const map = {};

  data.forEach((row) => {
    const name = row?._id?.[key] || 'unknown';
    const value = Number(row?.count) || 0;
    map[name] = (map[name] || 0) + value;
  });

  return Object.entries(map).map(([name, value]) => ({
    name,
    value,
  }));
}

function Empty() {
  return (
    <div className="h-56 flex items-center justify-center text-sm text-neutral-500">
      No payment data available
    </div>
  );
}

export default function PaymentsBreakdownCharts({ raw = [] }) {
  const byProvider = useMemo(() => normalize(raw, 'provider'), [raw]);

  const byStatus = useMemo(() => normalize(raw, 'status'), [raw]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <div className="text-sm font-medium text-neutral-800 mb-3">
          Payments by Provider
        </div>
        {byProvider.length === 0 ? (
          <Empty />
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byProvider}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {byProvider.map((e) => (
                    <Cell
                      key={e.name}
                      fill={PROVIDER_COLORS[e.name] || PROVIDER_COLORS.unknown}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div>
        <div className="text-sm font-medium text-neutral-800 mb-3">
          Payments by Status
        </div>
        {byStatus.length === 0 ? (
          <Empty />
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {byStatus.map((e) => (
                    <Cell
                      key={e.name}
                      fill={STATUS_COLORS[e.name] || STATUS_COLORS.unknown}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
