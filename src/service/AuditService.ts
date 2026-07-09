import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { AuditEntity } from "@/types/entites/AuditEntity";

interface AuditResponse {
  id: string;
  userId: string;
  prefectureId: string | null;
  email: string;
  role: string;
  actionTitle: string;
  actionType: string;
  resourceName: string;
  resourceId: string;
  createdAt?: string | null;
}

function formatAuditDate(value?: string | null): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function mapAudit(response: AuditResponse): AuditEntity {
  return {
    id: response.id,
    userId: response.userId,
    prefectureId: response.prefectureId ?? undefined,
    email: response.email,
    role: response.role,
    actionTitle: response.actionTitle,
    actionType: response.actionType,
    resourceName: response.resourceName,
    resourceId: response.resourceId,
    date: formatAuditDate(response.createdAt),
  };
}

export async function listAudits(): Promise<AuditEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/audit/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar auditoria");
  }

  const data = (await response.json()) as AuditResponse[];
  return data.map(mapAudit);
}
