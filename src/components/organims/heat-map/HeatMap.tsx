"use client";

import { AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import HeatMapFeatureBadge from "@/components/atom/heat-map/HeatMapFeatureBadge";
import HeatMapSummaryTile from "@/components/atom/heat-map/HeatMapSummaryTile";
import HeatMapGeneratePanel from "@/components/molecules/heat-map/HeatMapGeneratePanel";
import HeatMapHistoryCard from "@/components/molecules/heat-map/HeatMapHistoryCard";
import HeatMapPreviewPanel from "@/components/molecules/heat-map/HeatMapPreviewPanel";
import type { HeatMapEntity } from "@/types/entites/HeatMapEntity";
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
      {
        boardPointId: "point-03",
        name: "Rua das Mangueiras",
        boardTimeGoing: "07:02",
        boardTimeFinish: "12:34",
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
        boardPointId: "point-04",
        name: "Posto Vila Nova",
        boardTimeGoing: "06:35",
        boardTimeFinish: "12:10",
      },
      {
        boardPointId: "point-05",
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
        boardPointId: "point-06",
        name: "Rua das Flores",
        boardTimeGoing: "12:45",
        boardTimeFinish: "17:15",
      },
    ],
    status: "PAUSED",
    updatedAtLabel: "Atualizada há 4 dias",
  },
];

function createHeatMapDataUrl(route: RouteEntity, variant: number) {
  const warmOpacity = variant % 2 === 0 ? "0.82" : "0.68";
  const hotX = 360 + variant * 26;
  const hotY = 180 + variant * 18;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#0f172a"/>
          <stop offset="1" stop-color="#1e293b"/>
        </linearGradient>
        <radialGradient id="hot" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#fef08a" stop-opacity="0.96"/>
          <stop offset="0.35" stop-color="#fb923c" stop-opacity="${warmOpacity}"/>
          <stop offset="0.72" stop-color="#ef4444" stop-opacity="0.44"/>
          <stop offset="1" stop-color="#ef4444" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="soft" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#22d3ee" stop-opacity="0.54"/>
          <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="960" height="540" fill="url(#bg)"/>
      <g stroke="#334155" stroke-width="2" opacity="0.75">
        <path d="M40 116 C170 86 242 126 354 116 S574 82 704 112 861 142 920 116" fill="none"/>
        <path d="M64 262 C186 198 300 266 428 232 S654 212 810 262 902 296 936 284" fill="none"/>
        <path d="M104 424 C232 346 340 410 480 382 S704 354 860 430" fill="none"/>
        <path d="M214 42 C236 156 232 244 270 338 S322 444 340 512" fill="none"/>
        <path d="M596 34 C562 166 610 244 588 340 S544 428 578 512" fill="none"/>
      </g>
      <circle cx="${hotX}" cy="${hotY}" r="150" fill="url(#hot)"/>
      <circle cx="650" cy="308" r="132" fill="url(#hot)" opacity="0.82"/>
      <circle cx="238" cy="352" r="120" fill="url(#soft)"/>
      <g fill="#f8fafc" font-family="Inter, Arial, sans-serif">
        <text x="36" y="46" font-size="26" font-weight="700">${route.code} - mapa de calor</text>
        <text x="36" y="78" font-size="16" fill="#cbd5e1">${route.boardPoints.length} pontos de embarque considerados</text>
      </g>
    </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const mockHeatMaps: HeatMapEntity[] = [
  {
    id: "heat-map-01",
    route: mockRoutes[0],
    preSignedUrlHeatMap: createHeatMapDataUrl(mockRoutes[0], 1),
    createdAtLabel: "Gerado há 1 hora",
    pointsCount: mockRoutes[0].boardPoints.length,
  },
  {
    id: "heat-map-02",
    route: mockRoutes[0],
    preSignedUrlHeatMap: createHeatMapDataUrl(mockRoutes[0], 2),
    createdAtLabel: "Gerado ontem",
    pointsCount: mockRoutes[0].boardPoints.length,
  },
  {
    id: "heat-map-03",
    route: mockRoutes[1],
    preSignedUrlHeatMap: createHeatMapDataUrl(mockRoutes[1], 3),
    createdAtLabel: "Gerado há 3 dias",
    pointsCount: mockRoutes[1].boardPoints.length,
  },
];

export default function HeatMap() {
  const [selectedRouteId, setSelectedRouteId] = useState(
    mockRoutes[0]?.id ?? "",
  );
  const [heatMaps, setHeatMaps] = useState<HeatMapEntity[]>(mockHeatMaps);
  const [selectedHeatMapId, setSelectedHeatMapId] = useState(
    mockHeatMaps[0]?.id ?? "",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [routeSelectOpen, setRouteSelectOpen] = useState(false);
  const [error, setError] = useState("");

  const selectedRoute = useMemo(
    () => mockRoutes.find((route) => route.id === selectedRouteId),
    [selectedRouteId],
  );

  const routeHeatMaps = useMemo(
    () => heatMaps.filter((heatMap) => heatMap.route.id === selectedRouteId),
    [heatMaps, selectedRouteId],
  );

  const selectedHeatMap =
    routeHeatMaps.find((heatMap) => heatMap.id === selectedHeatMapId) ??
    routeHeatMaps[0];

  function handleRouteChange(routeId: string) {
    const nextRouteHeatMap = heatMaps.find(
      (heatMap) => heatMap.route.id === routeId,
    );

    setSelectedRouteId(routeId);
    setSelectedHeatMapId(nextRouteHeatMap?.id ?? "");
    setRouteSelectOpen(false);
    setError("");
  }

  function handleGenerateHeatMap() {
    if (!selectedRoute) {
      setError("Escolha uma rota antes de gerar o mapa de calor.");
      return;
    }

    setIsGenerating(true);
    setError("");

    window.setTimeout(() => {
      const nextHeatMap: HeatMapEntity = {
        id: `heat-map-${Date.now()}`,
        route: selectedRoute,
        preSignedUrlHeatMap: createHeatMapDataUrl(
          selectedRoute,
          heatMaps.length + 1,
        ),
        createdAtLabel: "Gerado agora",
        pointsCount: selectedRoute.boardPoints.length,
      };

      setHeatMaps((currentHeatMaps) => [nextHeatMap, ...currentHeatMaps]);
      setSelectedHeatMapId(nextHeatMap.id);
      setIsGenerating(false);
    }, 700);
  }

  function handleSelectHeatMap(heatMap: HeatMapEntity) {
    setSelectedHeatMapId(heatMap.id);
  }

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <HeatMapFeatureBadge />
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Mapa de calor de embarque
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Gere e consulte mapas de densidade por rota a partir dos pontos de
            embarque processados pelo backend.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[34rem]">
          <HeatMapSummaryTile label="Rotas" value={mockRoutes.length} />
          <HeatMapSummaryTile label="Mapas" value={heatMaps.length} />
          <HeatMapSummaryTile label="Nesta rota" value={routeHeatMaps.length} />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <HeatMapPreviewPanel heatMap={selectedHeatMap} />

        <HeatMapGeneratePanel
          routes={mockRoutes}
          selectedRoute={selectedRoute}
          selectedRouteId={selectedRouteId}
          routeSelectOpen={routeSelectOpen}
          mapsCount={routeHeatMaps.length}
          isGenerating={isGenerating}
          onRouteSelectOpenChange={setRouteSelectOpen}
          onRouteChange={handleRouteChange}
          onGenerateHeatMap={handleGenerateHeatMap}
        />
      </div>

      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-bold text-slate-950">Mapas desta rota</p>
            <p className="text-sm text-slate-500">
              Histórico filtrado pela rota selecionada.
            </p>
          </div>
        </div>

        {routeHeatMaps.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {routeHeatMaps.map((heatMap) => (
              <HeatMapHistoryCard
                key={heatMap.id}
                heatMap={heatMap}
                selected={heatMap.id === selectedHeatMap?.id}
                onSelect={handleSelectHeatMap}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">
            Nenhum mapa de calor foi gerado para esta rota ainda.
          </div>
        )}
      </section>
    </div>
  );
}
