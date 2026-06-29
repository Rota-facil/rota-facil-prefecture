import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import type { UserEntity } from "@/types/entites/UserEntity";

export async function getCurrentUser(): Promise<UserEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return response.json();
}
