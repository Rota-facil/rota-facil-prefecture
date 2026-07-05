import { Flame } from "lucide-react";

export default function HeatMapFeatureBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-1 text-xs font-semibold text-orange-700 shadow-sm">
      <Flame className="h-3.5 w-3.5" />
      Densidade de embarque
    </div>
  );
}
