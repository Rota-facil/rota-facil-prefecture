import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";

export type DocumentValidationStatus = "ANALYSIS" | "APPROVED" | "REJECTED";

export interface DriverDocument {
  id: string;
  originalFilename: string;
  url: string;
  validationStatus: DocumentValidationStatus;
}

export interface DriverFile {
  id: string;
  originalFilename: string;
  url: string;
}

async function multipart<T>(path: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${env.WEB_BASE_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (!response.ok) await handleHttpError(response, "Erro ao enviar documento");
  return response.json();
}

export function uploadDriverCnh(driverId: string, file: File) {
  return multipart<DriverDocument>(`/documents/cnh/drivers/${driverId}`, file);
}

export function uploadDriverPhoto(driverId: string, file: File) {
  return multipart<DriverFile>(
    `/files/users/profile-pic/drivers/${driverId}`,
    file,
  );
}

export async function fetchDriverPhoto(
  driverId: string,
): Promise<string | null> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/files/users/profile-pic/drivers/${driverId}`,
    { headers: { Authorization: `Bearer ${getToken()}` } },
  );
  if (response.status === 404) return null;
  if (!response.ok)
    await handleHttpError(response, "Erro ao buscar foto do motorista");
  return (await response.json()).url;
}

export async function fetchDriverCnh(
  driverId: string,
): Promise<DriverDocument | null> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/documents/cnh/${driverId}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );
  if (response.status === 404) return null;
  if (!response.ok) await handleHttpError(response, "Erro ao buscar CNH");
  return response.json();
}

export async function evaluateDriverDocument(
  documentId: string,
  status: DocumentValidationStatus,
): Promise<DriverDocument> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/documents/evaluate/${documentId}?evaluation_status=${status}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  );
  if (!response.ok)
    await handleHttpError(response, "Erro ao avaliar documento");
  return response.json();
}
