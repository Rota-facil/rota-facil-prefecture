import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { InstitutionEntity } from "@/types/entites/InstitutionEntity";

export async function listInstitutions(): Promise<InstitutionEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/places/institutions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar instituições");
  }

  return response.json();
}
