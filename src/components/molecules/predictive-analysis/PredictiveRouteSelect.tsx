import { Check, ChevronDown } from "lucide-react";
import type { RouteEntity } from "@/types/entites/RouteEntity";

interface PredictiveRouteSelectProps {
  routes: RouteEntity[];
  selectedRoute?: RouteEntity;
  selectedRouteId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteChange: (routeId: string) => void;
}

function formatRouteMeta(route: RouteEntity | undefined) {
  if (!route) {
    return "Selecione uma rota para gerar a análise.";
  }

  return `${route.institutions.length} instituição(ões) • ${route.boardPoints.length} ponto(s) de embarque`;
}

export default function PredictiveRouteSelect({
  routes,
  selectedRoute,
  selectedRouteId,
  open,
  onOpenChange,
  onRouteChange,
}: PredictiveRouteSelectProps) {
  return (
    <div>
      <label
        htmlFor="route-analysis-select"
        className="text-sm font-semibold text-slate-800"
      >
        Rota
      </label>
      <div className="relative mt-2">
        <button
          id="route-analysis-select"
          type="button"
          className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => onOpenChange(!open)}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
              {selectedRoute?.name[0].toUpperCase() ?? "R"}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-slate-900">
                {selectedRoute?.name ?? "Selecione uma rota"}
              </span>
              <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
                {formatRouteMeta(selectedRoute)}
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
            className="absolute left-0 top-[calc(100%+0.5rem)] z-50 max-h-72 w-full overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;

              return (
                <button
                  key={route.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-slate-50 aria-selected:bg-blue-50"
                  onClick={() => onRouteChange(route.id)}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                      {route.code}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-800">
                        {route.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {route.institutions.length} instituição(ões) •{" "}
                        {route.boardPoints.length} ponto(s)
                      </span>
                    </span>
                  </span>
                  {isSelected && (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
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
