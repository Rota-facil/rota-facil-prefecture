import { Flame, LoaderCircle, MapPinned } from "lucide-react";
import HeatMapRouteSelect from "@/components/molecules/heat-map/HeatMapRouteSelect";
import { Button } from "@/components/ui/button";
import type { RouteEntity } from "@/types/entites/RouteEntity";

interface HeatMapGeneratePanelProps {
  routes: RouteEntity[];
  selectedRoute?: RouteEntity;
  selectedRouteId: string;
  routeSelectOpen: boolean;
  mapsCount: number;
  isGenerating: boolean;
  onRouteSelectOpenChange: (open: boolean) => void;
  onRouteChange: (routeId: string) => void;
  onGenerateHeatMap: () => void;
}

export default function HeatMapGeneratePanel({
  routes,
  selectedRoute,
  selectedRouteId,
  routeSelectOpen,
  mapsCount,
  isGenerating,
  onRouteSelectOpenChange,
  onRouteChange,
  onGenerateHeatMap,
}: HeatMapGeneratePanelProps) {
  return (
    <section className="relative overflow-visible rounded-3xl border border-orange-100 bg-white shadow-[0_18px_45px_-28px_rgba(124,45,18,0.45)]">
      <div className="border-b border-orange-100 bg-[linear-gradient(135deg,rgba(249,115,22,0.12),rgba(239,68,68,0.08),rgba(255,255,255,0))] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">
              Gerar mapa de calor
            </p>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              O backend retornará uma URL pré-assinada para a imagem gerada.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <HeatMapRouteSelect
          routes={routes}
          selectedRoute={selectedRoute}
          selectedRouteId={selectedRouteId}
          open={routeSelectOpen}
          onOpenChange={onRouteSelectOpenChange}
          onRouteChange={onRouteChange}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Pontos
            </p>
            <p className="mt-1 text-xl font-bold text-slate-950">
              {selectedRoute?.boardPoints.length ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Mapas da rota
            </p>
            <p className="mt-1 text-xl font-bold text-slate-950">{mapsCount}</p>
          </div>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={!selectedRoute || isGenerating}
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 text-sm font-bold text-white shadow-[0_18px_42px_-24px_rgba(239,68,68,0.95)] hover:from-orange-600 hover:via-red-600 hover:to-rose-600 disabled:cursor-not-allowed"
          onClick={onGenerateHeatMap}
        >
          {isGenerating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <MapPinned className="h-4 w-4" />
          )}
          {isGenerating ? "Gerando mapa..." : "Gerar mapa da rota"}
        </Button>
      </div>
    </section>
  );
}
