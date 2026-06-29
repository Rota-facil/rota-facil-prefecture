import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
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
    throw new Error("Erro ao buscar metricas");
  }
  return response.json();
}
