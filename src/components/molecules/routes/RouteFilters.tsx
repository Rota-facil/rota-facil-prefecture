import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { RouteStatus } from "@/types/entites/RouteEntity";
import type { RouteShift } from "@/types/request/RouteRequest";

export type RouteShiftFilter = "ALL" | RouteShift;
export type RouteStatusFilter = "ALL" | RouteStatus;

interface RouteFiltersProps {
  shift: RouteShiftFilter;
  status: RouteStatusFilter;
  onShiftChange: (shift: RouteShiftFilter) => void;
  onStatusChange: (status: RouteStatusFilter) => void;
}

interface SelectOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface RouteFilterSelectProps<TValue extends string> {
  label: string;
  value: TValue;
  options: SelectOption<TValue>[];
  onChange: (value: TValue) => void;
}

export const shiftLabels: Record<RouteShift, string> = {
  MORNING: "Matutino",
  AFTERNOON: "Vespertino",
  NIGHT: "Noturno",
};

export const dayLabels = {
  MONDAY: "Seg",
  TUESDAY: "Ter",
  WEDNESDAY: "Qua",
  THURSDAY: "Qui",
  FRIDAY: "Sex",
  SATURDAY: "Sab",
  SUNDAY: "Dom",
};

const shiftOptions: SelectOption<RouteShiftFilter>[] = [
  { label: "Todos os turnos", value: "ALL" },
  { label: "Matutino", value: "MORNING" },
  { label: "Vespertino", value: "AFTERNOON" },
  { label: "Noturno", value: "NIGHT" },
];

const statusOptions: SelectOption<RouteStatusFilter>[] = [
  { label: "Todos os status", value: "ALL" },
  { label: "Ativas", value: "ACTIVE" },
  { label: "Pausadas", value: "PAUSED" },
];

function RouteFilterSelect<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: RouteFilterSelectProps<TValue>) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative min-w-44">
      <button
        type="button"
        className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#E5EAF0] bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-[#EEF2F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <span>{selectedOption?.label ?? label}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-12 z-20 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_45px_-18px_rgba(15,23,42,0.35)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex min-h-10 w-full cursor-pointer items-center justify-between rounded-lg px-3 text-left text-sm text-slate-700 transition hover:bg-[#EEF2F7]"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
              {option.value === value && (
                <Check className="h-4 w-4 text-[#1E3A8A]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RouteFilters({
  shift,
  status,
  onShiftChange,
  onStatusChange,
}: RouteFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <RouteFilterSelect
        label="Turno"
        value={shift}
        options={shiftOptions}
        onChange={onShiftChange}
      />
      <RouteFilterSelect
        label="Status"
        value={status}
        options={statusOptions}
        onChange={onStatusChange}
      />
    </div>
  );
}
