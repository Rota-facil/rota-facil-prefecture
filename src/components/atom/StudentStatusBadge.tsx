import type { StudentStatus } from "@/types/entites/StudentEntity";

interface StudentStatusBadgeProps {
  status: StudentStatus;
}

const statusConfig: Record<
  StudentStatus,
  { label: string; className: string; dotClassName: string }
> = {
  ACTIVE: {
    label: "Ativo",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dotClassName: "bg-emerald-600",
  },
  INACTIVE: {
    label: "Inativo",
    className: "bg-slate-100 text-slate-500 ring-slate-200",
    dotClassName: "bg-slate-400",
  },
};

export default function StudentStatusBadge({
  status,
}: StudentStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClassName}`} />
      {config.label}
    </span>
  );
}
