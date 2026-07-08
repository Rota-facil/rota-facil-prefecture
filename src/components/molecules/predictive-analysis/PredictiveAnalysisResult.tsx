import { BrainCircuit, Clock3, Sparkles } from "lucide-react";
import PredictiveRouteCodeBadge from "@/components/atom/predictive-analysis/PredictiveRouteCodeBadge";
import type { RouteEntity } from "@/types/entites/RouteEntity";

interface PredictiveAnalysisResultProps {
  selectedRoute?: RouteEntity;
  routeLabel: string;
  interpretation: string;
}

export default function PredictiveAnalysisResult({
  selectedRoute,
  routeLabel,
  interpretation,
}: PredictiveAnalysisResultProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">Resultado da IA</p>
            <p className="text-xs text-slate-500">
              Interpretação vinculada à rota
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {interpretation ? (
          <div className="min-h-72 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <PredictiveRouteCodeBadge
                label={selectedRoute ? routeLabel : "Rota"}
              />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
                <Clock3 className="h-3 w-3" />
                Seleção atual
              </span>
            </div>
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
              {interpretation}
            </p>
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-slate-400 shadow-sm">
              <BrainCircuit className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-700">
              Selecione uma rota e gere a análise
            </p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              A interpretação aparecerá aqui quando uma nova análise for criada.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
