import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { InstitutionEntity } from "@/types/entites/InstitutionEntity";
import type { CreateInstitutionRequest } from "@/types/request/InstitutionRequest";
import type { PageResponse } from "@/types/response/PageResponse";

interface InstitutionResponse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt?: string;
}

function mapInstitution(response: InstitutionResponse): InstitutionEntity {
  return {
    id: response.id,
    name: response.name,
    latitude: response.latitude,
    longitude: response.longitude,
    routeCount: 0,
    routes: [],
  };
}

export async function listInstitutionsPage(
  page: number,
  size: number,
): Promise<PageResponse<InstitutionEntity>> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/places/institutions?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar instituições");
  }

  const data = (await response.json()) as PageResponse<InstitutionResponse>;

  return {
    ...data,
    content: data.content.map(mapInstitution),
  };
}

export async function listInstitutions(): Promise<InstitutionEntity[]> {
  const response = await listInstitutionsPage(0, 100);
  return response.content;
}

export async function createInstitution(
  request: CreateInstitutionRequest,
): Promise<InstitutionEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/places/institutions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao criar instituição");
  }

  return mapInstitution(await response.json());
}

export async function updateInstitution(
  institutionId: string,
  request: CreateInstitutionRequest,
): Promise<InstitutionEntity> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/places/institutions/${institutionId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao atualizar instituição");
  }

  return mapInstitution(await response.json());
}

export async function deleteInstitution(institutionId: string): Promise<void> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/places/institutions/${institutionId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao excluir instituição");
  }
}
