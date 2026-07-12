import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { ReceivedFeedbackEntity } from "@/types/entites/ReceivedFeedbackEntity";

export async function listReceivedFeedbacks(
  userId: string,
): Promise<ReceivedFeedbackEntity[]> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/feedbacks/users/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao buscar feedbacks do usuário");
  }

  return response.json();
}
