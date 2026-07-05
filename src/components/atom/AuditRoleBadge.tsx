import type { AuditRole } from "@/types/entites/AuditEntity";

interface AuditRoleBadgeProps {
  role: AuditRole;
}

const roleConfig: Record<AuditRole, { label: string; className: string }> = {
  STUDENT: {
    label: "estudante",
    className: "bg-blue-50 text-blue-600",
  },
  DRIVER: {
    label: "motorista",
    className: "bg-amber-50 text-amber-600",
  },
  ADMIN: {
    label: "admin",
    className: "bg-slate-100 text-slate-600",
  },
  PREFECTURE: {
    label: "prefeitura",
    className: "bg-red-50 text-[#DC2626]",
  },
};

export default function AuditRoleBadge({ role }: AuditRoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
