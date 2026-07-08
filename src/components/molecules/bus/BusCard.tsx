"use client";

import { Bus, Trash2, Users } from "lucide-react";
import StatusBar from "@/components/atom/statusBar";
import { Button } from "@/components/ui/button";
import type { BusEntity } from "@/types/entites/BusEntity";

interface BusCardProps {
  bus: BusEntity;
  onViewDetails: (bus: BusEntity) => void;
  onDelete: (bus: BusEntity) => void;
}

const statusMap = {
  OPERATION: "busOperating",
  OUT_OF_OPERATION: "busOutOfOperation",
} as const;

export default function BusCard({
  bus,
  onViewDetails,
  onDelete,
}: BusCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5EAF0] bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_52px_-30px_rgba(15,23,42,0.5)]">
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_34%),radial-gradient(circle_at_85%_35%,rgba(255,255,255,0.18),transparent_30%)]" />
        <Bus className="relative h-16 w-16 text-white/90" strokeWidth={1.5} />
        <div className="absolute right-3 top-3">
          <StatusBar
            variant={statusMap[bus.status ?? "OUT_OF_OPERATION"]}
            size="xsm"
          />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate font-mono text-base font-bold tracking-wider text-slate-950">
            {bus.plate}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-[#1E3A8A]">
            <Users className="h-3.5 w-3.5" />
            {bus.capacity}
          </span>
        </div>

        <p className="mt-1 truncate text-xs text-slate-500">
          Motorista: {bus.driver?.name ?? "Sem motorista"}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-8 flex-1 cursor-pointer rounded-xl border-[#E5EAF0] text-xs font-semibold text-slate-700 hover:bg-[#EEF2F7]"
            onClick={() => onViewDetails(bus)}
          >
            Ver detalhe
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="h-8 w-8 cursor-pointer rounded-xl text-slate-400 hover:bg-red-50 hover:text-[#DC2626]"
            title="Excluir"
            aria-label={`Excluir ônibus ${bus.plate}`}
            onClick={() => onDelete(bus)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
