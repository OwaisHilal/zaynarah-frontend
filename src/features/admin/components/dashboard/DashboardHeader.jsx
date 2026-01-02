// src/features/admin/components/dashboard/DashboardHeader.jsx
import { Activity, RefreshCcw, Wifi, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export function DashboardHeader({ onRangeChange, onRefresh, isRefetching }) {
  const currentTime = useMemo(
    () =>
      new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    [isRefetching]
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-2">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Live Terminal
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock size={12} className="mt-0.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {currentTime} IST
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Store Intelligence
            <span className="text-slate-200 font-thin">/</span>
            <span className="text-indigo-600">HQ</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Real-time liquidity and logistics surveillance.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm ring-4 ring-slate-50">
          <Tabs
            defaultValue="30d"
            className="w-auto"
            onValueChange={onRangeChange}
          >
            <TabsList className="bg-transparent border-none h-9 gap-0">
              {['7d', '30d', '90d', 'all'].map((range) => (
                <TabsTrigger
                  key={range}
                  value={range}
                  className="rounded-xl px-4 h-7 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  {range}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="w-[1px] h-4 bg-slate-200 mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefetching}
            className="h-7 rounded-xl text-slate-500 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest gap-2"
          >
            <RefreshCcw
              size={14}
              className={cn(isRefetching && 'animate-spin')}
            />
            {isRefetching ? 'Syncing...' : 'Sync'}
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-2xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
        >
          <Wifi size={18} />
        </Button>
      </div>
    </div>
  );
}
