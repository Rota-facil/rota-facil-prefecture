"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export type StudentEmailFilter = "ALL" | "MUNICIPAL" | "GMAIL" | "OUTLOOK";
export type StudentScoreFilter = "ALL" | "HIGH" | "MEDIUM" | "LOW";
export type StudentFrequencyFilter =
  | "ALL"
  | "EXCELLENT"
  | "ATTENTION"
  | "CRITICAL";

interface StudentFiltersProps {
  score: StudentScoreFilter;
  frequency: StudentFrequencyFilter;
  onScoreChange: (score: StudentScoreFilter) => void;
  onFrequencyChange: (frequency: StudentFrequencyFilter) => void;
}

interface SelectOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface StudentFilterSelectProps<TValue extends string> {
  label: string;
  value: TValue;
  options: SelectOption<TValue>[];
  onChange: (value: TValue) => void;
}

const scoreOptions: SelectOption<StudentScoreFilter>[] = [
  { label: "Todas as notas", value: "ALL" },
  { label: "Score 4.0 a 5.0", value: "HIGH" },
  { label: "Score 3.0 a 3.9", value: "MEDIUM" },
  { label: "Score abaixo de 3.0", value: "LOW" },
];

const frequencyOptions: SelectOption<StudentFrequencyFilter>[] = [
  { label: "Todas frequências", value: "ALL" },
  { label: "90% ou mais", value: "EXCELLENT" },
  { label: "75% a 89%", value: "ATTENTION" },
  { label: "Abaixo de 75%", value: "CRITICAL" },
];

function StudentFilterSelect<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: StudentFilterSelectProps<TValue>) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative min-w-44">
      <button
        type="button"
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#E5EAF0] bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-[#EEF2F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <span>{selectedOption?.label ?? label}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-20 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_18px_45px_-18px_rgba(15,23,42,0.35)]">
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

export default function StudentFilters({
  score,
  frequency,
  onScoreChange,
  onFrequencyChange,
}: StudentFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StudentFilterSelect
        label="Score"
        value={score}
        options={scoreOptions}
        onChange={onScoreChange}
      />
      <StudentFilterSelect
        label="Frequência"
        value={frequency}
        options={frequencyOptions}
        onChange={onFrequencyChange}
      />
    </div>
  );
}
