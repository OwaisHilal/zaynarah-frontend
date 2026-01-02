// src/features/admin/components/dashboard/OrdersTrendChart.jsx

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TrendingUp, Download, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">
          {formatDate(label)}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-slate-300">Revenue</span>
            </div>
            <span className="text-sm font-black text-white">
              ₹{payload[1]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-slate-400" />
              <span className="text-xs font-bold text-slate-300">Orders</span>
            </div>
            <span className="text-sm font-black text-white">
              {payload[0]?.value}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function OrdersTrendChart({ data = [], onExport }) {
  const normalizedData = useMemo(
    () =>
      data.map((d) => ({
        date: d._id,
        count: Number(d.orders) || 0,
        revenue: Number(d.revenue) || 0,
      })),
    [data]
  );

  if (normalizedData.length === 0) {
    return (
      <div className="h-80 flex flex-col items-center justify-center text-sm text-slate-400 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200 m-8">
        <TrendingUp className="mb-2 opacity-20" size={32} />
        <p className="font-bold uppercase tracking-widest text-[10px]">
          No transaction flow detected
        </p>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between p-8 pb-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Performance Ledger
            </span>
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
            Revenue Dynamics
          </CardTitle>
          <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Correlating daily order volume with gross sales
          </CardDescription>
        </div>
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="rounded-xl border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={14} className="mr-2" />
            Export Data
          </Button>
        )}
      </CardHeader>

      <div className="h-80 w-full p-6 pt-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={normalizedData}
            margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="0"
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickFormatter={formatDate}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
              dy={15}
            />

            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 800 }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#e2e8f0',
                strokeWidth: 2,
                strokeDasharray: '4 4',
              }}
            />

            {/* Area for Orders (Background) */}
            <Area
              yAxisId="left"
              type="stepAfter"
              dataKey="count"
              stroke="#cbd5e1"
              strokeWidth={1}
              fill="transparent"
              animationDuration={1500}
            />

            {/* Area for Revenue (Foreground) */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              animationDuration={2000}
              activeDot={{
                r: 8,
                strokeWidth: 4,
                stroke: '#fff',
                fill: '#6366f1 shadow-xl',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
