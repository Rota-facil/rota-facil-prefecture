import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";

export interface EntityPhotoResponse {
  id: string;
  url: string;
  originalFilename: string;
}

export async function listEntityPhotos(
  resource: "vehicles" | "board-points",
  entityId: string,
): Promise<EntityPhotoResponse[]> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/files/${resource}/${entityId}/photos`,
    { headers: { Authorization: `Bearer ${getToken()}` } },
  );
  if (!response.ok) await handleHttpError(response, "Erro ao buscar foto");
  return response.json();
}

export async function uploadEntityPhoto(
  resource: "vehicles" | "board-points",
  entityId: string,
  file: File,
): Promise<EntityPhotoResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(
    `${env.WEB_BASE_URL}/files/${resource}/${entityId}/photos`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    },
  );
  if (!response.ok) await handleHttpError(response, "Erro ao salvar foto");
  return response.json();
}
