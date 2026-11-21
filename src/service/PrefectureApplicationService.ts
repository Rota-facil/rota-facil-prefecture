import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type {
  ApplicationStats,
  ApplicationStatus,
  PrefectureApplicationDetails,
  PrefectureApplicationForm,
  PrefectureApplicationSummary,
} from "@/types/PrefectureApplication";

/**
 * Contrato esperado do módulo de adesão.
 * O monólito atual ainda não expõe estes endpoints; as funções abaixo não
 * simulam respostas e propagarão o erro da API até o módulo ser disponibilizado.
 */
const APPLICATIONS_PATH = "/prefecture-applications";

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.WEB_BASE_URL}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...init?.headers },
  });

  if (!response.ok) {
    await handleHttpError(response, "Não foi possível concluir a operação");
  }

  return response.json();
}

export function createPrefectureApplication(data: PrefectureApplicationForm) {
  return request<{ id: string; protocol: string }>(APPLICATIONS_PATH, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadApplicationDocument(
  applicationId: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const response = await fetch(
    `${env.WEB_BASE_URL}${APPLICATIONS_PATH}/${applicationId}/documents`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Não foi possível enviar o documento");
  }

  return response.json();
}

export function getPublicApplication(token: string) {
  return request<PrefectureApplicationDetails>(
    `${APPLICATIONS_PATH}/public/${encodeURIComponent(token)}`,
  );
}

export function listPrefectureApplications(params?: {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  size?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  query.set("page", String(params?.page ?? 0));
  query.set("size", String(params?.size ?? 10));
  return request<{
    content: PrefectureApplicationSummary[];
    page: {
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
    };
  }>(`${APPLICATIONS_PATH}?${query.toString()}`);
}

export function getApplicationStats() {
  return request<ApplicationStats>(`${APPLICATIONS_PATH}/stats`);
}

export function getPrefectureApplication(applicationId: string) {
  return request<PrefectureApplicationDetails>(
    `${APPLICATIONS_PATH}/${applicationId}`,
  );
}

export function approvePrefectureApplication(applicationId: string) {
  return request<PrefectureApplicationDetails>(
    `${APPLICATIONS_PATH}/${applicationId}/approve`,
    { method: "POST" },
  );
}

export function rejectPrefectureApplication(
  applicationId: string,
  justification: string,
) {
  return request<PrefectureApplicationDetails>(
    `${APPLICATIONS_PATH}/${applicationId}/reject`,
    { method: "POST", body: JSON.stringify({ justification }) },
  );
}

export function requestApplicationInformation(
  applicationId: string,
  message: string,
) {
  return request<PrefectureApplicationDetails>(
    `${APPLICATIONS_PATH}/${applicationId}/additional-information`,
    { method: "POST", body: JSON.stringify({ message }) },
  );
}

export function addApplicationNote(applicationId: string, content: string) {
  return request<PrefectureApplicationDetails>(
    `${APPLICATIONS_PATH}/${applicationId}/notes`,
    { method: "POST", body: JSON.stringify({ content }) },
  );
}

export function validateInvitation(token: string) {
  return request<{ prefectureName: string; email: string }>(
    `/prefecture-invitations/${encodeURIComponent(token)}`,
  );
}

export function activateInvitation(token: string, password: string) {
  return request<{ accessToken: string }>("/prefecture-invitations/activate", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
