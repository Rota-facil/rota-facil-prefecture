import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { RouteEntity } from "@/types/entites/RouteEntity";
import type { CreateRouteRequest } from "@/types/request/RouteRequest";
import type { PageResponse } from "@/types/response/PageResponse";

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
  return response.json();
}

export async function addRoute(request: CreateRouteRequest) {
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
}
