import type { AuditActionType } from "@/types/entites/AuditEntity";

interface AuditActionBadgeProps {
  actionType: AuditActionType;
}

const actionConfig: Record<string, { label: string; className: string }> = {
  CREATE: {
    label: "CREATE",
    className: "bg-emerald-50 text-emerald-600",
  },
  UPDATE: {
    label: "UPDATE",
    className: "bg-blue-50 text-blue-600",
  },
  DELETE: {
    label: "DELETE",
    className: "bg-red-50 text-[#DC2626]",
  },
  FEEDBACK: {
    label: "FEEDBACK",
    className: "bg-amber-50 text-amber-600",
  },
  LOGOUT: {
    label: "LOGOUT",
    className: "bg-violet-50 text-violet-600",
  },
};

export default function AuditActionBadge({
  actionType,
}: AuditActionBadgeProps) {
  const config = actionConfig[actionType] ?? {
    label: actionType,
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
