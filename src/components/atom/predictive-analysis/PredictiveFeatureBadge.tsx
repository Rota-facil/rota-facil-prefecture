import { Sparkles } from "lucide-react";

export default function PredictiveFeatureBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
      <Sparkles className="h-3.5 w-3.5" />
      Inteligência operacional
    </div>
  );
}
