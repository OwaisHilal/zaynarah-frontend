import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function formatDate(value) {
  const d = new Date(value);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function OrdersTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-neutral-500">
        No order data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="_id"
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Tooltip
            labelFormatter={formatDate}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
