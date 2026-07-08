import { MapPinned } from "lucide-react";

interface HeatMapRouteBadgeProps {
  label: string;
}

export default function HeatMapRouteBadge({ label }: HeatMapRouteBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
      <MapPinned className="h-3 w-3" />
      {label}
    </span>
  );
}
