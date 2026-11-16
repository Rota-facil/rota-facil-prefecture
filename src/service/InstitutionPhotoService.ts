import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";

interface InstitutionPhotoResponse {
  id: string;
  url: string;
  originalFilename: string;
}

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function listInstitutionPhotos(
  institutionId: string,
): Promise<InstitutionPhotoResponse[]> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/files/institutions/${institutionId}/photos`,
    { headers: authHeaders() },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao buscar foto da instituição");
  }

  return response.json();
}

export async function uploadInstitutionPhoto(
  institutionId: string,
  file: File,
): Promise<InstitutionPhotoResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${env.WEB_BASE_URL}/files/institutions/${institutionId}/photos`,
    {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao salvar foto da instituição");
  }

  return response.json();
}
