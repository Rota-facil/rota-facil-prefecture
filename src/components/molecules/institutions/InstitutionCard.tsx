"use client";

import { Building2, MapPin, Route, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InstitutionEntity } from "@/types/entites/InstitutionEntity";

interface InstitutionCardProps {
  institution: InstitutionEntity;
  onViewDetails: (institution: InstitutionEntity) => void;
  onDelete: (institution: InstitutionEntity) => void;
}

export default function InstitutionCard({
  institution,
  onViewDetails,
  onDelete,
}: InstitutionCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5EAF0] bg-white shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_52px_-30px_rgba(15,23,42,0.5)]">
      <div className="relative h-30 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.28),transparent_34%),radial-gradient(circle_at_85%_35%,rgba(255,255,255,0.18),transparent_30%)]" />
        <Building2
          className="absolute bottom-2 right-3 h-10 w-10 text-white/30"
          strokeWidth={1.4}
        />
      </div>

      <div className="p-4">
        <div className="min-h-12">
          <h3 className="truncate text-base font-semibold text-slate-950">
            {institution.name}
          </h3>
          <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Lat. {institution.latitude.toFixed(4)} / Long.
              {institution.longitude.toFixed(4)}
            </span>
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-[#1E3A8A]">
            <Route className="h-3.5 w-3.5" />
            {institution.routeCount} rota(s)
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-8 flex-1 cursor-pointer rounded-xl border-[#E5EAF0] text-xs font-semibold text-slate-700 hover:bg-[#EEF2F7]"
            onClick={() => onViewDetails(institution)}
          >
            Ver detalhe
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="h-8 w-8 cursor-pointer rounded-xl text-slate-400 hover:bg-red-50 hover:text-[#DC2626]"
            title="Excluir"
            aria-label={`Excluir ${institution.name}`}
            onClick={() => onDelete(institution)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
