import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { MetricResponse } from "@/types/response/MetricResponse";

export async function getMetrics(): Promise<MetricResponse> {
  const response = await fetch(`${env.WEB_BASE_URL}/transports/metrics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao buscar métricas");
  }
  return response.json();
}
