import { Check, ChevronDown } from "lucide-react";
import type { RouteEntity } from "@/types/entites/RouteEntity";

interface HeatMapRouteSelectProps {
  routes: RouteEntity[];
  selectedRoute?: RouteEntity;
  selectedRouteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteChange: (routeId: string) => void;
}

function getRouteLabel(route: RouteEntity | undefined, index: number) {
  if (!route) {
    return "R";
  }

  return `${route.name[0]?.toUpperCase() ?? "R"}-${index + 1}`;
}

function routeMeta(route: RouteEntity | undefined) {
  if (!route) {
    return "Selecione uma rota para visualizar os mapas.";
  }

  return `${route.boardPoints.length} ponto(s) • ${route.bus[0]?.label ?? "sem ônibus"}`;
}

export default function HeatMapRouteSelect({
  routes,
  selectedRoute,
  selectedRouteId,
  open,
  onOpenChange,
  onRouteChange,
}: HeatMapRouteSelectProps) {
  const selectedRouteIndex = routes.findIndex(
    (route) => route.id === selectedRouteId,
  );

  return (
    <div>
      <label
        htmlFor="heat-map-route-select"
        className="text-sm font-semibold text-slate-800"
      >
        Rota
      </label>
      <div className="relative mt-2">
        <button
          id="heat-map-route-select"
          type="button"
          className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-left shadow-sm transition hover:border-orange-200 hover:bg-orange-50/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => onOpenChange(!open)}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-xs font-bold text-orange-700 ring-1 ring-orange-100">
              {getRouteLabel(selectedRoute, Math.max(selectedRouteIndex, 0))}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-slate-900">
                {selectedRoute?.name ?? "Selecione uma rota"}
              </span>
              <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
                {routeMeta(selectedRoute)}
              </span>
            </span>
          </span>
          <ChevronDown
            className={
              open
                ? "h-4 w-4 shrink-0 rotate-180 text-slate-400 transition-transform"
                : "h-4 w-4 shrink-0 text-slate-400 transition-transform"
            }
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute left-0 top-[calc(100%+0.5rem)] z-50 max-h-72 w-full overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] [scrollbar-color:#FDBA74_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-300 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {routes.map((route, routeIndex) => {
              const isSelected = route.id === selectedRouteId;

              return (
                <button
                  key={route.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-orange-50 aria-selected:bg-orange-50"
                  onClick={() => onRouteChange(route.id)}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                      {getRouteLabel(route, routeIndex)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-800">
                        {route.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {route.boardPoints.length} ponto(s) •{" "}
                        {route.daysOfWeek.length} dia(s)
                      </span>
                    </span>
                  </span>
                  {isSelected && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
