import type { ApplicationStatus } from "@/types/PrefectureApplication";

const config: Record<ApplicationStatus, { label: string; className: string }> =
  {
    UNDER_ANALYSIS: {
      label: "Em análise",
      className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    ADDITIONAL_INFO_REQUIRED: {
      label: "Aguardando informações",
      className: "bg-violet-50 text-violet-700 ring-violet-200",
    },
    APPROVED: {
      label: "Aprovada",
      className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    REJECTED: {
      label: "Rejeitada",
      className: "bg-red-50 text-red-700 ring-red-200",
    },
  };

export default function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const item = config[status];
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${item.className}`}
    >
      {item.label}
    </span>
  );
}
