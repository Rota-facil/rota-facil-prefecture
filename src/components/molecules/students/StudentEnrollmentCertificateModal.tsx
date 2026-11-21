"use client";

import { X } from "lucide-react";
import { useState } from "react";
import DocumentPreview from "@/components/atom/DocumentPreview";
import { Button } from "@/components/ui/button";
import { formatDocumentStatus } from "@/lib/documentStatus";
import type { DocumentValidationStatus } from "@/service/DriverDocumentService";
import {
  evaluateStudentEnrollmentCertificate,
  type StudentEnrollmentCertificate,
} from "@/service/StudentDocumentService";
import type { StudentEntity } from "@/types/entites/StudentEntity";

const documentEvaluationButtonStyles = {
  ANALYSIS: {
    inactive:
      "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100",
    active: "border-amber-500 bg-amber-500 text-white hover:bg-amber-600",
  },
  APPROVED: {
    inactive:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100",
    active: "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700",
  },
  REJECTED: {
    inactive:
      "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
    active: "border-red-600 bg-red-600 text-white hover:bg-red-700",
  },
} as const;

interface StudentEnrollmentCertificateModalProps {
  student: StudentEntity;
  document: StudentEnrollmentCertificate;
  onClose: () => void;
  onDocumentChanged?: (status: DocumentValidationStatus) => void;
}

export default function StudentEnrollmentCertificateModal({
  student,
  document,
  onClose,
  onDocumentChanged,
}: StudentEnrollmentCertificateModalProps) {
  const [currentDocument, setCurrentDocument] = useState(document);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const documentStatus = formatDocumentStatus(currentDocument.validationStatus);

  async function evaluate(status: DocumentValidationStatus) {
    if (isEvaluating || status === currentDocument.validationStatus) return;

    setIsEvaluating(true);
    try {
      const updatedDocument = await evaluateStudentEnrollmentCertificate(
        currentDocument.id,
        status,
      );
      setCurrentDocument(updatedDocument);
      onDocumentChanged?.(updatedDocument.validationStatus);
    } finally {
      setIsEvaluating(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Comprovante de matrícula"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5EAF0] px-6 py-5">
          <div>
            <p className="text-lg font-bold text-slate-950">
              Comprovante de matrícula
            </p>
            <p className="mt-1 text-sm text-slate-500">{student.name}</p>
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fechar comprovante"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 overflow-y-auto p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Documento enviado pelo aluno
              </p>
              <p className="text-xs text-slate-500">
                Clique no arquivo para visualizar em tamanho maior.
              </p>
            </div>
            <span
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${documentStatus.className}`}
            >
              {documentStatus.label}
            </span>
          </div>

          <DocumentPreview
            src={currentDocument.url}
            name={currentDocument.originalFilename}
          />

          <div className="flex flex-wrap gap-2">
            {(["ANALYSIS", "APPROVED", "REJECTED"] as const).map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                disabled={isEvaluating}
                variant="outline"
                className={`h-10 rounded-xl border px-4 text-sm font-semibold transition-colors ${documentEvaluationButtonStyles[status][currentDocument.validationStatus === status ? "active" : "inactive"]}`}
                onClick={() => evaluate(status)}
              >
                {status === "ANALYSIS"
                  ? "Em análise"
                  : status === "APPROVED"
                    ? "Aceitar"
                    : "Rejeitar"}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-[#E5EAF0] px-6 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-xl border-[#E5EAF0] px-4 font-semibold hover:bg-[#EEF2F7]"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
