import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: {
    container: "max-w-[340px] h-[160px] p-3",
    iconWrapper: "h-12 w-12",
    icon: "h-6 w-6",
    title: "text-base",
    value: "text-5xl",
    badge: "px-3 py-1 text-sm",
  },

  md: {
    container: "max-w-[380px] h-[180px] p-7",
    iconWrapper: "h-14 w-14",
    icon: "h-7 w-7",
    title: "text-lg",
    value: "text-6xl",
    badge: "px-3 py-1 text-sm",
  },

  lg: {
    container: "max-w-[420px] h-[210px] p-8",
    iconWrapper: "h-16 w-16",
    icon: "h-8 w-8",
    title: "text-xl",
    value: "text-7xl",
    badge: "px-4 py-1.5 text-base",
  },
};

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  size = "sm",
}: MetricCardProps) {
  const s = sizes[size];

  return (
    <div
      className={`w-full rounded-3xl border border-slate-200 bg-white shadow-sm ${s.container}`}
    >
      <div className="flex h-full flex-col">
        {/* Topo */}
        <div className="flex items-start justify-between">
          <div
            className={`flex ${s.iconWrapper} items-center justify-center rounded-full bg-slate-100`}
          >
            <Icon className={`${s.icon} text-blue-600`} />
          </div>

          {trend !== undefined && (
            <div
              className={`rounded-full bg-slate-100 font-medium text-slate-600 ${s.badge}`}
            >
              ↗ +{trend}
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="mt-2">
          <p className={`${s.title} text-slate-500`}>{title}</p>

          <h2 className={`${s.value} font-bold leading-none text-slate-900`}>
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}
