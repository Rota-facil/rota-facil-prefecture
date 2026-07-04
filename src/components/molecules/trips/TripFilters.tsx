"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export type TripStatusFilter =
  | "ALL"
  | "IN_ROUTE"
  | "FINISHED"
  | "CANCELLED"
  | "WAITING";

interface TripFiltersProps {
  status: TripStatusFilter;
  onStatusChange: (status: TripStatusFilter) => void;
}

interface SelectOption<TValue extends string> {
  label: string;
  value: TValue;
}

const statusOptions: SelectOption<TripStatusFilter>[] = [
  { label: "Todos os status", value: "ALL" },
  { label: "Em rota", value: "IN_ROUTE" },
  { label: "Finalizadas", value: "FINISHED" },
  { label: "Canceladas", value: "CANCELLED" },
  { label: "Aguardando", value: "WAITING" },
];

export default function TripFilters({
  status,
  onStatusChange,
}: TripFiltersProps) {
  const [open, setOpen] = useState(false);
  const selectedOption = statusOptions.find(
    (option) => option.value === status,
  );

  return (
    <div className="relative min-w-44">
      <button
        type="button"
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#E5EAF0] bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-[#EEF2F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30"
        aria-label="Status da viagem"
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <span>{selectedOption?.label ?? "Status"}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-20 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_45px_-18px_rgba(15,23,42,0.35)]">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex min-h-10 w-full cursor-pointer items-center justify-between rounded-lg px-3 text-left text-sm text-slate-700 transition hover:bg-[#EEF2F7]"
              onClick={() => {
                onStatusChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
              {option.value === status && (
                <Check className="h-4 w-4 text-[#1E3A8A]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
