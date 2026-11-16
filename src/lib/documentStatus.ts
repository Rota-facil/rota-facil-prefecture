import type { DocumentValidationStatus } from "@/service/DriverDocumentService";

export function formatDocumentStatus(status?: DocumentValidationStatus | null) {
  switch (status) {
    case "APPROVED":
      return {
        label: "Docs: Em dia",
        className: "border border-emerald-200 bg-emerald-50 text-emerald-700",
      };
    case "REJECTED":
      return {
        label: "Docs: Rejeitada",
        className: "border border-red-200 bg-red-50 text-red-700",
      };
    default:
      return {
        label: "Docs: Em análise",
        className: "border border-amber-200 bg-amber-50 text-amber-700",
      };
  }
}
