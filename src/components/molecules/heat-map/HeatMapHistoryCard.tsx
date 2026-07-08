import { CalendarDays, MapPinned } from "lucide-react";
import Image from "next/image";
import HeatMapRouteBadge from "@/components/atom/heat-map/HeatMapRouteBadge";
import type { HeatMapEntity } from "@/types/entites/HeatMapEntity";

interface HeatMapHistoryCardProps {
  heatMap: HeatMapEntity;
  routeLabel: string;
  selected: boolean;
  onSelect: (heatMap: HeatMapEntity) => void;
}

export default function HeatMapHistoryCard({
  heatMap,
  routeLabel,
  selected,
  onSelect,
}: HeatMapHistoryCardProps) {
  return (
    <button
      type="button"
      className={
        selected
          ? "cursor-pointer rounded-2xl border border-orange-300 bg-orange-50 p-3 text-left shadow-sm transition"
          : "cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-[0_18px_45px_-28px_rgba(239,68,68,0.55)]"
      }
      onClick={() => onSelect(heatMap)}
    >
      <div className="overflow-hidden rounded-xl bg-slate-900">
        <Image
          src={heatMap.preSignedUrlHeatMap}
          alt={`Miniatura do mapa de calor da rota ${heatMap.route.name}`}
          width={640}
          height={360}
          unoptimized
          className="aspect-[16/9] w-full object-cover"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <HeatMapRouteBadge label={routeLabel} />
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
          <CalendarDays className="h-3 w-3" />
          {heatMap.createdAtLabel}
        </span>
      </div>
      <p className="mt-3 line-clamp-1 text-sm font-bold text-slate-950">
        {heatMap.route.name}
      </p>
      <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
        <MapPinned className="h-3 w-3" />
        {heatMap.pointsCount} ponto(s) considerados
      </p>
    </button>
  );
}
