import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import type { BusEntity } from "@/types/entites/BusEntity";
import { InstitutionEntity } from "@/types/entites/InstitutionEntity";

export async function listBus(): Promise<BusEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/transports/bus`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw Error("Erro ao listar ônibus");
  }

  return response.json();
}
