// src/features/admin/components/dashboard/DashboardHeader.jsx
import { Activity, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function DashboardHeader({ onRangeChange, onRefresh, isRefetching }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
          <Activity size={14} /> Analytics Overview
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Store Insights
        </h1>
        <p className="text-slate-500 font-medium">
          Monitoring platform performance and logistics in real-time.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
        <Tabs
          defaultValue="30d"
          className="w-auto"
          onValueChange={onRangeChange}
        >
          <TabsList className="bg-transparent border-none gap-1">
            {['7d', '30d', '90d', 'all'].map((range) => (
              <TabsTrigger
                key={range}
                value={range}
                className="rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all text-xs font-bold uppercase"
              >
                {range}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="w-[1px] h-6 bg-slate-200 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isRefetching}
          className="rounded-xl text-slate-600 font-bold"
        >
          <RefreshCcw
            size={16}
            className={cn('mr-2', isRefetching && 'animate-spin')}
          />
          Sync
        </Button>
      </div>
    </div>
  );
}
