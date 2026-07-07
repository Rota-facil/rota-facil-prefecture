import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
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
    throw Error("Erro ao listar rotas");
  }
  return response.json();
}

export async function addRoute(request: CreateRouteRequest) {
  await fetch(`${env.WEB_BASE_URL}/transports/routes/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
