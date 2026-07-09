import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { PredictiveAnalysisEntity } from "@/types/entites/PredictiveAnalysisEntity";
import type { RouteEntity } from "@/types/entites/RouteEntity";
import type { CreateRouteRequest } from "@/types/request/RouteRequest";
import type { PageResponse } from "@/types/response/PageResponse";

interface RouteInterpretationResponse {
  id: string;
  routeId: string;
  routeInterpretation: string;
  createdAt?: string | null;
}

function formatAnalysisCreatedAt(value?: string | null): string {
  if (!value) {
    return "Gerada recentemente";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Gerada recentemente";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function mapPredictiveAnalysis(
  response: RouteInterpretationResponse,
  route: RouteEntity,
): PredictiveAnalysisEntity {
  const createdAt = response.createdAt
    ? new Date(response.createdAt)
    : undefined;

  return {
    id: response.id,
    route,
    interpretation: response.routeInterpretation,
    createdAtLabel: formatAnalysisCreatedAt(response.createdAt),
    createdAt:
      createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt : undefined,
  };
}
interface RouteInstitutionResponse {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
}

interface RouteBoardPointResponse {
  id: string;
  boardPointId: string;
  name: string;
  latitude?: number;
  longitude?: number;
  boardTimeGoing: string;
  boardTimeFinish: string;
}

interface RouteBusResponse {
  id: string;
  plate: string;
}

interface RouteResponse {
  id: string;
  name: string;
  shift: RouteEntity["shift"];
  going: string;
  return_: string;
  goingFinish: string;
  returnFinish: string;
  interpretation?: string | null;
  createdAt?: string;
  daysOfWeek: RouteEntity["daysOfWeek"];
  institutions: RouteInstitutionResponse[];
  boardPoints: RouteBoardPointResponse[];
  bus: RouteBusResponse[];
}

function formatTime(value: string): string {
  return value.slice(0, 5);
}

function mapRoute(response: RouteResponse): RouteEntity {
  return {
    id: response.id,
    code: `R-${response.id.slice(0, 4).toUpperCase()}`,
    name: response.name,
    shift: response.shift,
    going: formatTime(response.going),
    return_: formatTime(response.return_),
    goingFinish: formatTime(response.goingFinish),
    returnFinish: formatTime(response.returnFinish),
    daysOfWeek: response.daysOfWeek,
    institutions: response.institutions.map((institution) => ({
      id: institution.id,
      name: institution.name,
    })),
    bus: response.bus.map((busItem) => ({
      id: busItem.id,
      label: busItem.plate,
    })),
    boardPoints: response.boardPoints.map((boardPoint) => ({
      boardPointId: boardPoint.boardPointId,
      name: boardPoint.name,
      boardTimeGoing: formatTime(boardPoint.boardTimeGoing),
      boardTimeFinish: formatTime(boardPoint.boardTimeFinish),
    })),
    status: "ACTIVE",
    updatedAtLabel: response.createdAt ? "Cadastrada" : "Cadastrada",
  };
}

export async function listRoutes(
  page: number,
  size: number,
): Promise<PageResponse<RouteEntity>> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/routes?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar rotas");
  }

  const data = (await response.json()) as PageResponse<RouteResponse>;

  return {
    ...data,
    content: data.content.map(mapRoute),
  };
}

export async function listRoutesSimple(): Promise<RouteEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/transports/routes/simple`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar rotas");
  }

  const data = (await response.json()) as RouteResponse[];
  return data.map(mapRoute);
}

export async function addRoute(
  request: CreateRouteRequest,
): Promise<RouteEntity> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/routes/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao cadastrar rota");
  }

  return mapRoute(await response.json());
}

export async function updateRoute(
  routeId: string,
  request: CreateRouteRequest,
): Promise<RouteEntity> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/routes/${routeId}`,
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
    await handleHttpError(response, "Erro ao atualizar rota");
  }

  return mapRoute(await response.json());
}

export async function deleteRoute(routeId: string): Promise<void> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/routes/${routeId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao excluir rota");
  }
}

export async function listRouteAnalyses(
  route: RouteEntity,
): Promise<PredictiveAnalysisEntity[]> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/routes/${route.id}/interpretations`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar análises da rota");
  }

  const data = (await response.json()) as RouteInterpretationResponse[];
  return data.map((analysis) => mapPredictiveAnalysis(analysis, route));
}

export async function generateRouteAnalysis(
  route: RouteEntity,
): Promise<PredictiveAnalysisEntity> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/routes/${route.id}/interpreter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao gerar análise da rota");
  }

  return mapPredictiveAnalysis(await response.json(), route);
}

export async function deleteRouteAnalysis(
  routeId: string,
  analysisId: string,
): Promise<void> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/routes/${routeId}/interpretations/${analysisId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao excluir análise da rota");
  }
}
