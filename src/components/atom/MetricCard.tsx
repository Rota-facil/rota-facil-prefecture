import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
}: MetricCardProps) {
  return (
    <Card className="w-full max-w-[380px] rounded-[24px] border border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>

          {trend !== undefined && (
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-500">
              ↗ +{trend}
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="text-base text-slate-500">{title}</p>

          <h2 className="mt-2 text-5xl font-bold text-slate-900">{value}</h2>
        </div>
      </CardContent>
    </Card>
  );
}
