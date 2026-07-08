"use client";

import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PredictiveFeatureBadge from "@/components/atom/predictive-analysis/PredictiveFeatureBadge";
import PredictiveSummaryCard from "@/components/atom/predictive-analysis/PredictiveSummaryCard";
import PredictiveAnalysisRecentCard from "@/components/molecules/predictive-analysis/PredictiveAnalysisRecentCard";
import PredictiveAnalysisResult from "@/components/molecules/predictive-analysis/PredictiveAnalysisResult";
import PredictiveGeneratePanel from "@/components/molecules/predictive-analysis/PredictiveGeneratePanel";
import {
  generateRouteAnalysis,
  listRouteAnalyses,
  listRoutesSimple,
} from "@/service/RouteService";
import type { PredictiveAnalysisEntity } from "@/types/entites/PredictiveAnalysisEntity";
import type { RouteEntity } from "@/types/entites/RouteEntity";

export default function PredictiveAnalysis() {
  const [routes, setRoutes] = useState<RouteEntity[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [currentResult, setCurrentResult] = useState("");
  const [recentAnalyses, setRecentAnalyses] = useState<
    PredictiveAnalysisEntity[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [routeSelectOpen, setRouteSelectOpen] = useState(false);

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === selectedRouteId),
    [routes, selectedRouteId],
  );

  const selectedRouteHasAnalysis = recentAnalyses.some(
    (analysis) => analysis.route.id === selectedRoute?.id,
  );

  const fetchAnalyses = useCallback(async (route: RouteEntity) => {
    const analyses = await listRouteAnalyses(route);
    setRecentAnalyses(analyses);
    setCurrentResult(analyses[0]?.interpretation ?? "");
  }, []);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        setError("");
        const routesFound = await listRoutesSimple();
        setRoutes(routesFound);

        const firstRoute = routesFound[0];
        if (firstRoute) {
          setSelectedRouteId(firstRoute.id);
          await fetchAnalyses(firstRoute);
        }
      } catch (e) {
        setError((e as Error).message);
      }
    }

    fetchRoutes();
  }, [fetchAnalyses]);

  async function handleRouteChange(routeId: string) {
    const route = routes.find((routeItem) => routeItem.id === routeId);

    setSelectedRouteId(routeId);
    setCurrentResult("");
    setError("");
    setRouteSelectOpen(false);

    if (!route) {
      return;
    }

    try {
      await fetchAnalyses(route);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleGenerateAnalysis() {
    if (!selectedRoute) {
      setError("Escolha uma rota antes de gerar a análise.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const nextAnalysis = await generateRouteAnalysis(selectedRoute);
      setCurrentResult(nextAnalysis.interpretation);
      setRecentAnalyses((currentAnalyses) => [
        nextAnalysis,
        ...currentAnalyses.filter(
          (analysis) => analysis.id !== nextAnalysis.id,
        ),
      ]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSelectAnalysis(analysis: PredictiveAnalysisEntity) {
    setSelectedRouteId(analysis.route.id);
    setCurrentResult(analysis.interpretation);
  }

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <PredictiveFeatureBadge />
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Análise preditiva de rotas
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Selecione uma rota e gere uma interpretação automática com base nos
            dados operacionais disponíveis.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-96">
          <PredictiveSummaryCard
            label="Rotas disponíveis"
            value={routes.length}
          />
          <PredictiveSummaryCard
            label="Análises recentes"
            value={recentAnalyses.length}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <PredictiveGeneratePanel
          routes={routes}
          selectedRoute={selectedRoute}
          selectedRouteId={selectedRouteId}
          routeSelectOpen={routeSelectOpen}
          hasAnalysis={selectedRouteHasAnalysis}
          isGenerating={isGenerating}
          onRouteSelectOpenChange={setRouteSelectOpen}
          onRouteChange={handleRouteChange}
          onGenerateAnalysis={handleGenerateAnalysis}
        />

        <PredictiveAnalysisResult
          selectedRoute={selectedRoute}
          interpretation={currentResult}
        />
      </div>

      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-bold text-slate-950">
              Análises recentes
            </p>
            <p className="text-sm text-slate-500">
              Histórico de interpretações geradas para a rota selecionada.
            </p>
          </div>
        </div>

        {recentAnalyses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm font-medium text-slate-500">
            Nenhuma análise gerada para esta rota.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentAnalyses.slice(0, 6).map((analysis) => (
              <PredictiveAnalysisRecentCard
                key={analysis.id}
                analysis={analysis}
                onSelect={handleSelectAnalysis}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
