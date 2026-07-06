import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import type { BoardPointEntity } from "@/types/entites/BoardPointEntity";
import { InstitutionEntity } from "@/types/entites/InstitutionEntity";

export async function listBoardPoints(): Promise<BoardPointEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/places/board-points`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw Error("Erro ao listar pontos de embaruqe");
  }

  return response.json();
}
