import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { HeatMapEntity } from "@/types/entites/HeatMapEntity";
import type { RouteEntity } from "@/types/entites/RouteEntity";

interface GenerateHeatMapResponse {
  preSignedUrlHeatMap: string;
}

interface HeatMapFileResponse {
  id: string;
  originalFilename: string;
  presignedUrl: string;
  fileCategory: "ROUTE_BOARD_POINT_HEAT_MAP";
  ownerType: "ROUTE";
  createdAt?: string | null;
}

function formatHeatMapCreatedAt(value?: string | null): string {
  if (!value) {
    return "Gerado recentemente";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Gerado recentemente";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function mapHeatMapFile(
  response: HeatMapFileResponse,
  route: RouteEntity,
): HeatMapEntity {
  const createdAt = response.createdAt
    ? new Date(response.createdAt)
    : undefined;

  return {
    id: response.id,
    route,
    preSignedUrlHeatMap: response.presignedUrl,
    createdAtLabel: formatHeatMapCreatedAt(response.createdAt),
    createdAt:
      createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt : undefined,
    pointsCount: route.boardPoints.length,
  };
}

export async function listRouteHeatMaps(
  route: RouteEntity,
): Promise<HeatMapEntity[]> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/files/heat-map/${route.id}/all`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar mapas de calor da rota");
  }

  const data = (await response.json()) as HeatMapFileResponse[];
  return data.map((heatMap) => mapHeatMapFile(heatMap, route));
}

export async function generateRouteHeatMap(
  route: RouteEntity,
): Promise<HeatMapEntity> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/routes/${route.id}/board-point/heat-map`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao gerar mapa de calor da rota");
  }

  const data = (await response.json()) as GenerateHeatMapResponse;

  return {
    id: `generated-${Date.now()}`,
    route,
    preSignedUrlHeatMap: data.preSignedUrlHeatMap,
    createdAtLabel: "Gerado agora",
    createdAt: new Date(),
    pointsCount: route.boardPoints.length,
  };
}

export async function deleteRouteHeatMap(heatMapId: string): Promise<void> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/files/heat-map/${heatMapId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao excluir mapa de calor");
  }
}
