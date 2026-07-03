import type { RouteStatus } from "@/types/entites/RouteEntity";

const statusStyle = {
  ACTIVE: {
    label: "Ativa",
    className: "bg-emerald-50 text-emerald-600 ring-emerald-200/80",
  },
  PAUSED: {
    label: "Pausada",
    className: "bg-amber-50 text-amber-700 ring-amber-200/80",
  },
};

interface RouteStatusBadgeProps {
  status: RouteStatus;
}

export default function RouteStatusBadge({ status }: RouteStatusBadgeProps) {
  const currentStatus = statusStyle[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${currentStatus.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {currentStatus.label}
    </span>
  );
}
