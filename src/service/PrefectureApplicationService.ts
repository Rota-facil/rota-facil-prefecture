import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type {
  ApplicationDocument,
  ApplicationStatus,
  PrefectureApplicationDetails,
  PrefectureApplicationForm,
  PrefectureApplicationSummary,
} from "@/types/PrefectureApplication";

const APPLICATIONS_PATH = "/prefecture-applications";

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
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

export async function createPrefectureApplication(
  data: PrefectureApplicationForm,
  files: File[],
) {
  const formData = new FormData();
  const request = {
    name: data.prefectureName,
    municipality: data.municipality,
    state: data.state,
    ibgeCode: data.ibgeCode || null,
    cnpj: data.cnpj,
    institutionalEmail: data.institutionalEmail,
    institutionalPhone: data.institutionalPhone,
    responsibleName: data.responsibleName,
    responsibleEmail: data.responsibleEmail,
    responsiblePhone: data.responsiblePhone,
    responsibleCpf: data.responsibleCpf,
  };
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" }),
  );
  for (const file of files) formData.append("files", file);

  const response = await fetch(`${env.WEB_BASE_URL}${APPLICATIONS_PATH}`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    await handleHttpError(response, "Não foi possível enviar a solicitação");
  }

  return response.json() as Promise<{
    id: string;
    publicAccessToken: string;
  }>;
}

export function getPublicApplication(publicAccessToken: string) {
  return request<PrefectureApplicationDetails>(
    `${APPLICATIONS_PATH}?public_access_token=${encodeURIComponent(publicAccessToken)}`,
  );
}

export function getPrefectureApplicationDocuments(applicationId: string) {
  return request<ApplicationDocument[]>(
    `/files/prefecture-applications/documents/${encodeURIComponent(applicationId)}`,
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
  }>(`${APPLICATIONS_PATH}/list?${query.toString()}`);
}

export interface ManagedPrefecture {
  id: string;
  name: string;
  region: string;
}

export function listManagedPrefectures() {
  return request<ManagedPrefecture[]>("/prefectures");
}

export function deleteManagedPrefecture(prefectureId: string) {
  return request<void>(`/prefectures/${encodeURIComponent(prefectureId)}`, {
    method: "DELETE",
  });
}

export interface PrefectureOverview extends ManagedPrefecture {
  activeUsers: number;
  activeStudents: number;
  activeDrivers: number;
  activeVehicles: number;
  activeRoutes: number;
  activeTrips: number;
  activeInstitutions: number;
  activeBoardPoints: number;
}

export function getPrefectureOverview(prefectureId: string) {
  return request<PrefectureOverview>(
    `/prefectures/${encodeURIComponent(prefectureId)}/overview`,
  );
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
