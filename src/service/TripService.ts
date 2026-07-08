import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { TripEntity } from "@/types/entites/TripEntity";
import type { PageResponse } from "@/types/response/PageResponse";

export async function listTrips(
  page: number,
  size: number,
): Promise<PageResponse<TripEntity>> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/trips?page=${page}&size=${size}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar viagens");
  }

  return response.json();
}
