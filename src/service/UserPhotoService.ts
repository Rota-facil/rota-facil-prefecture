import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";

export interface UserPhotoResponse {
  id: string;
  userId: string;
  originalFilename: string;
  url: string;
  fileCategory: string;
  createdAt: string;
}

export async function listUserPhotos(
  userIds: string[],
): Promise<UserPhotoResponse[]> {
  if (userIds.length === 0) {
    return [];
  }

  const response = await fetch(
    `${env.WEB_BASE_URL}/files/users/profile-pic/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ usersId: userIds }),
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao buscar fotos dos estudantes");
  }

  return response.json();
}
