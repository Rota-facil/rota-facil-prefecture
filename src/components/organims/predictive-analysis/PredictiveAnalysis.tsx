"use client";

import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import PredictiveFeatureBadge from "@/components/atom/predictive-analysis/PredictiveFeatureBadge";
import PredictiveSummaryCard from "@/components/atom/predictive-analysis/PredictiveSummaryCard";
import PredictiveAnalysisRecentCard from "@/components/molecules/predictive-analysis/PredictiveAnalysisRecentCard";
import PredictiveAnalysisResult from "@/components/molecules/predictive-analysis/PredictiveAnalysisResult";
import PredictiveGeneratePanel from "@/components/molecules/predictive-analysis/PredictiveGeneratePanel";
import type { PredictiveAnalysisEntity } from "@/types/entites/PredictiveAnalysisEntity";
import type { RouteEntity } from "@/types/entites/RouteEntity";

const mockRoutes: RouteEntity[] = [
  {
    id: "route-12",
    code: "R-12",
    name: "Centro -> E.M. João Paulo",
    shift: "MORNING",
    going: "06:30",
    goingFinish: "07:20",
    return_: "12:00",
    returnFinish: "12:50",
    daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    institutions: [
      { id: "inst-01", name: "E.M. João Paulo" },
      { id: "inst-02", name: "E.E. Santos Dumont" },
    ],
    bus: [{ id: "bus-01", label: "Ônibus 01" }],
    boardPoints: [
      {
        boardPointId: "point-01",
        name: "Praça Central",
        boardTimeGoing: "06:40",
        boardTimeFinish: "12:10",
      },
      {
        boardPointId: "point-02",
        name: "Posto Vila Nova",
        boardTimeGoing: "06:55",
        boardTimeFinish: "12:25",
      },
    ],
    status: "ACTIVE",
    updatedAtLabel: "Atualizada há 2 dias",
  },
  {
    id: "route-08",
    code: "R-08",
    name: "Vila Nova -> E.E. Santos Dumont",
    shift: "MORNING",
    going: "06:20",
    goingFinish: "07:10",
    return_: "11:50",
    returnFinish: "12:35",
    daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    institutions: [{ id: "inst-02", name: "E.E. Santos Dumont" }],
    bus: [{ id: "bus-02", label: "Ônibus 02" }],
    boardPoints: [
      {
        boardPointId: "point-02",
        name: "Posto Vila Nova",
        boardTimeGoing: "06:35",
        boardTimeFinish: "12:10",
      },
      {
        boardPointId: "point-03",
        name: "Comunidade Rural",
        boardTimeGoing: "06:50",
        boardTimeFinish: "12:22",
      },
    ],
    status: "ACTIVE",
    updatedAtLabel: "Atualizada ontem",
  },
  {
    id: "route-04",
    code: "R-04",
    name: "Bairro Alto -> CMEI Girassol",
    shift: "AFTERNOON",
    going: "12:30",
    goingFinish: "13:20",
    return_: "17:00",
    returnFinish: "17:45",
    daysOfWeek: ["MONDAY", "WEDNESDAY", "FRIDAY"],
    institutions: [{ id: "inst-03", name: "CMEI Girassol" }],
    bus: [{ id: "bus-03", label: "Ônibus 03" }],
    boardPoints: [
      {
        boardPointId: "point-04",
        name: "Rua das Flores",
        boardTimeGoing: "12:45",
        boardTimeFinish: "17:15",
      },
    ],
    status: "PAUSED",
    updatedAtLabel: "Atualizada há 4 dias",
  },
];

const mockAnalyses: PredictiveAnalysisEntity[] = [
  {
    id: "analysis-01",
    route: mockRoutes[0],
    createdAtLabel: "Gerada há 2 horas",
    interpretation:
      "A rota R-12 apresenta comportamento estável no turno matutino. O histórico indica maior pressão operacional entre 06:40 e 07:05, principalmente nos dois primeiros pontos de embarque. Recomenda-se acompanhar a pontualidade da saída inicial e manter o ônibus atual para evitar perda de margem no horário de chegada.",
  },
  {
    id: "analysis-02",
    route: mockRoutes[1],
    createdAtLabel: "Gerada ontem",
    interpretation:
      "A rota R-08 tende a concentrar embarques em pontos afastados, com risco moderado de atraso quando há variação no tempo de deslocamento até a Comunidade Rural. O planejamento atual é adequado, mas a rota se beneficiaria de uma revisão fina nos horários de embarque caso o volume de estudantes aumente.",
  },
];

function createMockInterpretation(route: RouteEntity) {
  const firstPoint = route.boardPoints[0]?.name ?? "primeiro ponto";
  const lastPoint = route.boardPoints.at(-1)?.name ?? "último ponto";

  return `A rota ${route.code} foi avaliada com base nos horários cadastrados, pontos de embarque e recorrência semanal. A operação aparenta maior sensibilidade entre ${firstPoint} e ${lastPoint}, especialmente no período de saída. Recomenda-se monitorar a ocupação do ônibus ${route.bus[0]?.label ?? "vinculado"} e comparar a pontualidade das próximas viagens para confirmar a tendência.`;
}

export default function PredictiveAnalysis() {
  const [selectedRouteId, setSelectedRouteId] = useState(
    mockRoutes[0]?.id ?? "",
  );
  const [currentResult, setCurrentResult] = useState(
    mockAnalyses[0]?.interpretation ?? "",
  );
  const [recentAnalyses, setRecentAnalyses] =
    useState<PredictiveAnalysisEntity[]>(mockAnalyses);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [routeSelectOpen, setRouteSelectOpen] = useState(false);

  const selectedRoute = useMemo(
    () => mockRoutes.find((route) => route.id === selectedRouteId),
    [selectedRouteId],
  );

  const selectedRouteHasAnalysis = recentAnalyses.some(
    (analysis) => analysis.route.id === selectedRoute?.id,
  );

  function handleRouteChange(routeId: string) {
    const routeAnalysis = recentAnalyses.find(
      (analysis) => analysis.route.id === routeId,
    );

    setSelectedRouteId(routeId);
    setCurrentResult(routeAnalysis?.interpretation ?? "");
    setError("");
    setRouteSelectOpen(false);
  }

  function handleGenerateAnalysis() {
    if (!selectedRoute) {
      setError("Escolha uma rota antes de gerar a análise.");
      return;
    }

    setIsGenerating(true);
    setError("");

    window.setTimeout(() => {
      const interpretation = createMockInterpretation(selectedRoute);
      const nextAnalysis: PredictiveAnalysisEntity = {
        id: `analysis-${Date.now()}`,
        route: selectedRoute,
        interpretation,
        createdAtLabel: "Gerada agora",
      };

      setCurrentResult(interpretation);
      setRecentAnalyses((currentAnalyses) => [
        nextAnalysis,
        ...currentAnalyses.filter(
          (analysis) => analysis.route.id !== selectedRoute.id,
        ),
      ]);
      setIsGenerating(false);
    }, 700);
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
            value={mockRoutes.length}
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
          routes={mockRoutes}
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
              Histórico de interpretações geradas para rotas diferentes.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentAnalyses.slice(0, 6).map((analysis) => (
            <PredictiveAnalysisRecentCard
              key={analysis.id}
              analysis={analysis}
              onSelect={handleSelectAnalysis}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
