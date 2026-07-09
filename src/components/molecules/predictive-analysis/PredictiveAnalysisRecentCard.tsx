import { Trash2 } from "lucide-react";
import PredictiveRouteCodeBadge from "@/components/atom/predictive-analysis/PredictiveRouteCodeBadge";
import { Button } from "@/components/ui/button";
import type { PredictiveAnalysisEntity } from "@/types/entites/PredictiveAnalysisEntity";

interface PredictiveAnalysisRecentCardProps {
  analysis: PredictiveAnalysisEntity;
  routeLabel: string;
  onSelect: (analysis: PredictiveAnalysisEntity) => void;
  onDelete: (analysis: PredictiveAnalysisEntity) => void;
}

export default function PredictiveAnalysisRecentCard({
  analysis,
  routeLabel,
  onSelect,
  onDelete,
}: PredictiveAnalysisRecentCardProps) {
  return (
    <div className="relative min-h-44 rounded-2xl border border-slate-200 bg-white p-5 pr-12 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_45px_-28px_rgba(37,99,235,0.55)]">
      <button
        type="button"
        className="block w-full cursor-pointer text-left"
        onClick={() => onSelect(analysis)}
      >
        <div className="flex items-center justify-between gap-3">
          <PredictiveRouteCodeBadge label={routeLabel} />
          <span className="text-xs font-medium text-slate-400">
            {analysis.createdAtLabel}
          </span>
        </div>
        <p className="mt-4 line-clamp-1 text-sm font-bold text-slate-950">
          {analysis.route.name}
        </p>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
          {analysis.interpretation}
        </p>
      </button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 h-8 w-8 cursor-pointer rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600"
        aria-label="Excluir análise"
        onClick={() => onDelete(analysis)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
