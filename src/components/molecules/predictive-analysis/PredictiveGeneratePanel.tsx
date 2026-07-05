import {
  BrainCircuit,
  CheckCircle2,
  LoaderCircle,
  WandSparkles,
} from "lucide-react";
import PredictiveRouteSelect from "@/components/molecules/predictive-analysis/PredictiveRouteSelect";
import { Button } from "@/components/ui/button";
import type { RouteEntity } from "@/types/entites/RouteEntity";

interface PredictiveGeneratePanelProps {
  routes: RouteEntity[];
  selectedRoute?: RouteEntity;
  selectedRouteId: string;
  routeSelectOpen: boolean;
  hasAnalysis: boolean;
  isGenerating: boolean;
  onRouteSelectOpenChange: (open: boolean) => void;
  onRouteChange: (routeId: string) => void;
  onGenerateAnalysis: () => void;
}

function formatRouteMeta(route: RouteEntity | undefined) {
  if (!route) {
    return "Selecione uma rota para gerar a análise.";
  }

  return `${route.institutions.length} instituição(ões) • ${route.boardPoints.length} ponto(s) de embarque`;
}

export default function PredictiveGeneratePanel({
  routes,
  selectedRoute,
  selectedRouteId,
  routeSelectOpen,
  hasAnalysis,
  isGenerating,
  onRouteSelectOpenChange,
  onRouteChange,
  onGenerateAnalysis,
}: PredictiveGeneratePanelProps) {
  return (
    <section className="relative overflow-visible rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]">
      <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(30,58,138,0.08),rgba(20,184,166,0.08),rgba(255,255,255,0))] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-teal-500 text-white shadow-md">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">
              Gerar nova análise
            </p>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              A análise parte da rota selecionada e fica associada a ela no
              histórico.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <PredictiveRouteSelect
          routes={routes}
          selectedRoute={selectedRoute}
          selectedRouteId={selectedRouteId}
          open={routeSelectOpen}
          onOpenChange={onRouteSelectOpenChange}
          onRouteChange={onRouteChange}
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-950">
                {selectedRoute?.name ?? "Nenhuma rota selecionada"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {formatRouteMeta(selectedRoute)}
              </p>
            </div>
            {hasAnalysis && (
              <div className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 className="h-3 w-3" />
                Gerada
              </div>
            )}
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={!selectedRoute || isGenerating}
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 text-sm font-bold text-white shadow-[0_18px_42px_-24px_rgba(37,99,235,0.95)] hover:from-blue-800 hover:via-blue-700 hover:to-teal-600 disabled:cursor-not-allowed"
          onClick={onGenerateAnalysis}
        >
          {isGenerating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <WandSparkles className="h-4 w-4" />
          )}
          {isGenerating ? "Gerando análise..." : "Gerar análise com IA"}
        </Button>
      </div>
    </section>
  );
}
