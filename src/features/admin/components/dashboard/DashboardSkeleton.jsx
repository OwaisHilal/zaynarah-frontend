import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-slate-200 rounded-full" />
          <div className="h-10 w-64 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-12 w-32 bg-slate-200 rounded-xl" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-slate-100 rounded-[24px] border border-slate-200"
          />
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-200 rounded-[32px]">
          <CardHeader className="h-20 border-b border-slate-100" />
          <CardContent className="h-[300px] flex items-end justify-between p-8 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-full bg-slate-100 rounded-t-lg"
                style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 rounded-[32px]">
          <CardHeader className="h-20 border-b border-slate-100" />
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="h-48 w-48 rounded-full border-[16px] border-slate-100" />
          </CardContent>
        </Card>
      </div>

      {/* Lower Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] bg-slate-50 rounded-[32px] border border-slate-200" />
        <div className="h-[400px] bg-slate-50 rounded-[32px] border border-slate-200" />
      </div>
    </div>
  );
}
