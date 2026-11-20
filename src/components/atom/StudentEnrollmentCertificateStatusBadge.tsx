import { formatDocumentStatus } from "@/lib/documentStatus";
import type { DocumentValidationStatus } from "@/service/DriverDocumentService";

export type StudentEnrollmentCertificateStatus =
  | DocumentValidationStatus
  | "NOT_REGISTERED"
  | "LOADING";

interface Props {
  status?: StudentEnrollmentCertificateStatus;
}

export default function StudentEnrollmentCertificateStatusBadge({
  status,
}: Props) {
  if (status === "LOADING" || !status) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
        Consultando...
      </span>
    );
  }

  if (status === "NOT_REGISTERED") {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-200">
        Não cadastrado
      </span>
    );
  }

  const config = formatDocumentStatus(status);
  const label =
    status === "APPROVED"
      ? "Aprovado"
      : status === "REJECTED"
        ? "Rejeitado"
        : "Em análise";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      {label}
    </span>
  );
}
