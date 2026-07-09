"use client";

import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import HeatMapFeatureBadge from "@/components/atom/heat-map/HeatMapFeatureBadge";
import HeatMapSummaryTile from "@/components/atom/heat-map/HeatMapSummaryTile";
import HeatMapGeneratePanel from "@/components/molecules/heat-map/HeatMapGeneratePanel";
import HeatMapHistoryCard from "@/components/molecules/heat-map/HeatMapHistoryCard";
import HeatMapPreviewPanel from "@/components/molecules/heat-map/HeatMapPreviewPanel";
import {
  deleteRouteHeatMap,
  generateRouteHeatMap,
  listRouteHeatMaps,
} from "@/service/HeatMapService";
import { listRoutesSimple } from "@/service/RouteService";
import type { HeatMapEntity } from "@/types/entites/HeatMapEntity";
import type { RouteEntity } from "@/types/entites/RouteEntity";

function getRouteLabel(route: RouteEntity | undefined, index: number) {
  if (!route) {
    return "R";
  }

  return `${route.name[0]?.toUpperCase() ?? "R"}-${index + 1}`;
}

export default function HeatMap() {
  const [routes, setRoutes] = useState<RouteEntity[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [heatMaps, setHeatMaps] = useState<HeatMapEntity[]>([]);
  const [selectedHeatMapId, setSelectedHeatMapId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [routeSelectOpen, setRouteSelectOpen] = useState(false);
  const [error, setError] = useState("");

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === selectedRouteId),
    [routes, selectedRouteId],
  );

  const selectedHeatMap =
    heatMaps.find((heatMap) => heatMap.id === selectedHeatMapId) ?? heatMaps[0];

  const selectedRouteIndex = routes.findIndex(
    (route) => route.id === selectedRouteId,
  );
  const selectedRouteLabel = getRouteLabel(
    selectedRoute,
    Math.max(selectedRouteIndex, 0),
  );

  const fetchHeatMaps = useCallback(async (route: RouteEntity) => {
    const maps = await listRouteHeatMaps(route);
    setHeatMaps(maps);
    setSelectedHeatMapId(maps[0]?.id ?? "");
  }, []);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        setError("");
        setIsLoading(true);

        const routesFound = await listRoutesSimple();
        setRoutes(routesFound);

        const firstRoute = routesFound[0];
        if (firstRoute) {
          setSelectedRouteId(firstRoute.id);
          await fetchHeatMaps(firstRoute);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoutes();
  }, [fetchHeatMaps]);

  async function handleRouteChange(routeId: string) {
    const route = routes.find((routeItem) => routeItem.id === routeId);

    setSelectedRouteId(routeId);
    setHeatMaps([]);
    setSelectedHeatMapId("");
    setRouteSelectOpen(false);
    setError("");

    if (!route) {
      return;
    }

    try {
      setIsLoading(true);
      await fetchHeatMaps(route);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateHeatMap() {
    if (!selectedRoute) {
      setError("Escolha uma rota antes de gerar o mapa de calor.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const generatedHeatMap = await generateRouteHeatMap(selectedRoute);
      setHeatMaps((currentHeatMaps) => [generatedHeatMap, ...currentHeatMaps]);
      setSelectedHeatMapId(generatedHeatMap.id);

      await fetchHeatMaps(selectedRoute);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSelectHeatMap(heatMap: HeatMapEntity) {
    setSelectedHeatMapId(heatMap.id);
  }

  async function handleDeleteHeatMap(heatMap: HeatMapEntity) {
    try {
      setError("");
      await deleteRouteHeatMap(heatMap.id);

      setHeatMaps((currentHeatMaps) => {
        const nextHeatMaps = currentHeatMaps.filter(
          (currentHeatMap) => currentHeatMap.id !== heatMap.id,
        );

        if (selectedHeatMapId === heatMap.id) {
          setSelectedHeatMapId(nextHeatMaps[0]?.id ?? "");
        }

        return nextHeatMaps;
      });
    } catch (e) {
      setError((e as Error).message);
    }
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
          <HeatMapSummaryTile label="Rotas" value={routes.length} />
          <HeatMapSummaryTile label="Mapas" value={heatMaps.length} />
          <HeatMapSummaryTile label="Nesta rota" value={heatMaps.length} />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <HeatMapPreviewPanel
          heatMap={selectedHeatMap}
          routeLabel={selectedRouteLabel}
        />

        <HeatMapGeneratePanel
          routes={routes}
          selectedRoute={selectedRoute}
          selectedRouteId={selectedRouteId}
          routeSelectOpen={routeSelectOpen}
          mapsCount={heatMaps.length}
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

        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">
            Carregando mapas de calor...
          </div>
        ) : heatMaps.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {heatMaps.map((heatMap) => (
              <HeatMapHistoryCard
                key={heatMap.id}
                heatMap={heatMap}
                routeLabel={selectedRouteLabel}
                selected={heatMap.id === selectedHeatMap?.id}
                onSelect={handleSelectHeatMap}
                onDelete={handleDeleteHeatMap}
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
