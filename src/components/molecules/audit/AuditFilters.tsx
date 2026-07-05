"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { AuditActionType, AuditRole } from "@/types/entites/AuditEntity";

export type AuditRoleFilter = "ALL" | AuditRole;
export type AuditActionFilter = "ALL" | AuditActionType;
export type AuditResourceFilter = "ALL" | string;

interface AuditFiltersProps {
  role: AuditRoleFilter;
  actionType: AuditActionFilter;
  resource: AuditResourceFilter;
  resourceOptions: string[];
  onRoleChange: (role: AuditRoleFilter) => void;
  onActionTypeChange: (actionType: AuditActionFilter) => void;
  onResourceChange: (resource: AuditResourceFilter) => void;
}

interface SelectOption<TValue extends string> {
  label: string;
  value: TValue;
}

interface AuditFilterSelectProps<TValue extends string> {
  label: string;
  value: TValue;
  options: SelectOption<TValue>[];
  onChange: (value: TValue) => void;
}

const roleOptions: SelectOption<AuditRoleFilter>[] = [
  { label: "Todos os perfis", value: "ALL" },
  { label: "Estudante", value: "STUDENT" },
  { label: "Motorista", value: "DRIVER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Prefeitura", value: "PREFECTURE" },
];

const actionTypeOptions: SelectOption<AuditActionFilter>[] = [
  { label: "Todas as ações", value: "ALL" },
  { label: "CREATE", value: "CREATE" },
  { label: "UPDATE", value: "UPDATE" },
  { label: "DELETE", value: "DELETE" },
  { label: "FEEDBACK", value: "FEEDBACK" },
];

function AuditFilterSelect<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: AuditFilterSelectProps<TValue>) {
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

export default function AuditFilters({
  role,
  actionType,
  resource,
  resourceOptions,
  onRoleChange,
  onActionTypeChange,
  onResourceChange,
}: AuditFiltersProps) {
  const resourceSelectOptions: SelectOption<AuditResourceFilter>[] = [
    { label: "Todos os recursos", value: "ALL" },
    ...resourceOptions.map((resourceName) => ({
      label: resourceName,
      value: resourceName,
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <AuditFilterSelect
        label="Perfil"
        value={role}
        options={roleOptions}
        onChange={onRoleChange}
      />
      <AuditFilterSelect
        label="Ação"
        value={actionType}
        options={actionTypeOptions}
        onChange={onActionTypeChange}
      />
      <AuditFilterSelect
        label="Recurso"
        value={resource}
        options={resourceSelectOptions}
        onChange={onResourceChange}
      />
    </div>
  );
}
