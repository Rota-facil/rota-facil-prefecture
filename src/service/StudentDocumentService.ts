import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import type { DocumentValidationStatus } from "@/service/DriverDocumentService";
import { handleHttpError } from "@/service/HttpErrorService";

export interface StudentEnrollmentCertificate {
  id: string;
  originalFilename: string;
  url: string;
  validationStatus: DocumentValidationStatus;
}

export async function fetchStudentEnrollmentCertificate(
  studentId: string,
): Promise<StudentEnrollmentCertificate | null> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/documents/enrollment-certificate/${studentId}`,
    { headers: { Authorization: `Bearer ${getToken()}` } },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    await handleHttpError(response, "Erro ao buscar comprovante de matrícula");
  }

  return response.json();
}

export async function evaluateStudentEnrollmentCertificate(
  documentId: string,
  status: DocumentValidationStatus,
): Promise<StudentEnrollmentCertificate> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/documents/evaluate/${documentId}?evaluation_status=${status}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao avaliar comprovante de matrícula");
  }

  return response.json();
}
