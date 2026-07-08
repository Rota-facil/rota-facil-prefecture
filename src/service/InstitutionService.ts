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

interface InstitutionRouteCountResponse {
  institutionId: string;
  routeCount: number;
}

function mapInstitution(
  response: InstitutionResponse,
  routeCountByInstitutionId: Map<string, number> = new Map(),
): InstitutionEntity {
  return {
    id: response.id,
    name: response.name,
    latitude: response.latitude,
    longitude: response.longitude,
    routeCount: routeCountByInstitutionId.get(response.id) ?? 0,
    routes: [],
  };
}

async function listInstitutionRouteCounts(): Promise<Map<string, number>> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/institutions/route-counts`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar rotas das instituições");
  }

  const data = (await response.json()) as InstitutionRouteCountResponse[];
  return new Map(data.map((item) => [item.institutionId, item.routeCount]));
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

  const [data, routeCountByInstitutionId] = await Promise.all([
    response.json() as Promise<PageResponse<InstitutionResponse>>,
    listInstitutionRouteCounts(),
  ]);

  return {
    ...data,
    content: data.content.map((institution) =>
      mapInstitution(institution, routeCountByInstitutionId),
    ),
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
