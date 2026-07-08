import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { NotificationEntity } from "@/types/entites/NotificationEntity";
import type { PageResponse } from "@/types/response/PageResponse";

export async function listMyNotifications(
  page: number,
  size: number,
): Promise<PageResponse<NotificationEntity>> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/notifications/my?page=${page}&size=${size}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar notificações");
  }
  return response.json();
}
