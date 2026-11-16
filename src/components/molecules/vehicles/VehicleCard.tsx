"use client";

import { Trash2, Truck, Users } from "lucide-react";
import StatusBar from "@/components/atom/statusBar";
import { Button } from "@/components/ui/button";
import { formatVehicleType } from "@/lib/vehicleType";
import type { VehicleEntity } from "@/types/entites/VehicleEntity";

interface VehicleCardProps {
  vehicle: VehicleEntity;
  photoUrl?: string;
  onViewDetails: (vehicle: VehicleEntity) => void;
  onDelete: (vehicle: VehicleEntity) => void;
}

const statusMap = {
  OPERATION: "vehicleOperating",
  OUT_OF_OPERATION: "vehicleOutOfOperation",
} as const;

export default function VehicleCard({
  vehicle,
  photoUrl,
  onViewDetails,
  onDelete,
}: VehicleCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5EAF0] bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_52px_-30px_rgba(15,23,42,0.5)]">
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_34%),radial-gradient(circle_at_85%_35%,rgba(255,255,255,0.18),transparent_30%)]" />
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`Foto do veículo ${vehicle.plate}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <Truck
            className="relative h-16 w-16 text-white/90"
            strokeWidth={1.5}
          />
        )}
        <div className="absolute right-3 top-3">
          <StatusBar
            variant={statusMap[vehicle.status ?? "OUT_OF_OPERATION"]}
            size="xsm"
          />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate font-mono text-base font-bold tracking-wider text-slate-950">
            {vehicle.plate}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-[#1E3A8A]">
            <Users className="h-3.5 w-3.5" />
            {vehicle.capacity}
          </span>
        </div>

        <p className="mt-1 truncate text-xs text-slate-500">
          Motorista: {vehicle.driver?.name ?? "Sem motorista"}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Tipo: {formatVehicleType(vehicle.vehicleType)}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-8 flex-1 cursor-pointer rounded-xl border-[#E5EAF0] text-xs font-semibold text-slate-700 hover:bg-[#EEF2F7]"
            onClick={() => onViewDetails(vehicle)}
          >
            Ver detalhe
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="h-8 w-8 cursor-pointer rounded-xl text-slate-400 hover:bg-red-50 hover:text-[#DC2626]"
            title="Excluir"
            aria-label={`Excluir veículo ${vehicle.plate}`}
            onClick={() => onDelete(vehicle)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
