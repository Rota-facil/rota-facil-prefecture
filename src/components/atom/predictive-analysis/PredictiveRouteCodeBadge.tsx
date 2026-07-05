import { Route } from "lucide-react";

interface PredictiveRouteCodeBadgeProps {
  code: string;
}

export default function PredictiveRouteCodeBadge({
  code,
}: PredictiveRouteCodeBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
      <Route className="h-3 w-3" />
      {code}
    </span>
  );
}
