import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { BoardPointEntity } from "@/types/entites/BoardPointEntity";

export async function listBoardPoints(): Promise<BoardPointEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/places/board-points`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar pontos de embarque");
  }

  return response.json();
}
