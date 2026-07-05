import PredictiveRouteCodeBadge from "@/components/atom/predictive-analysis/PredictiveRouteCodeBadge";
import type { PredictiveAnalysisEntity } from "@/types/entites/PredictiveAnalysisEntity";

interface PredictiveAnalysisRecentCardProps {
  analysis: PredictiveAnalysisEntity;
  onSelect: (analysis: PredictiveAnalysisEntity) => void;
}

export default function PredictiveAnalysisRecentCard({
  analysis,
  onSelect,
}: PredictiveAnalysisRecentCardProps) {
  return (
    <button
      type="button"
      className="min-h-44 cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_45px_-28px_rgba(37,99,235,0.55)]"
      onClick={() => onSelect(analysis)}
    >
      <div className="flex items-center justify-between gap-3">
        <PredictiveRouteCodeBadge code={analysis.route.code} />
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
  );
}
