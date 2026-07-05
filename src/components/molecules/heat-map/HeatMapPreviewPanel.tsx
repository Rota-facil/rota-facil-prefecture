import { ImageIcon, MapPinned } from "lucide-react";
import Image from "next/image";
import HeatMapRouteBadge from "@/components/atom/heat-map/HeatMapRouteBadge";
import type { HeatMapEntity } from "@/types/entites/HeatMapEntity";

interface HeatMapPreviewPanelProps {
  heatMap?: HeatMapEntity;
}

export default function HeatMapPreviewPanel({
  heatMap,
}: HeatMapPreviewPanelProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
            <MapPinned className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">Mapa gerado</p>
            <p className="text-xs text-slate-500">
              Imagem retornada por URL pré-assinada
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {heatMap ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
              <HeatMapRouteBadge code={heatMap.route.code} />
              <span className="text-xs font-medium text-slate-300">
                {heatMap.createdAtLabel}
              </span>
            </div>
            <div className="overflow-hidden rounded-xl bg-slate-900">
              <Image
                src={heatMap.preSignedUrlHeatMap}
                alt={`Mapa de calor da rota ${heatMap.route.code}`}
                width={960}
                height={540}
                unoptimized
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-slate-400 shadow-sm">
              <ImageIcon className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-700">
              Selecione uma rota e gere o mapa
            </p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              A imagem do mapa de calor aparecerá aqui quando houver uma URL
              disponível.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
