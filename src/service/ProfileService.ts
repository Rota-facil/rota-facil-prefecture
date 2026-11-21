import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { UserEntity } from "@/types/entites/UserEntity";

interface ProfilePhotoResponse {
  url: string;
}

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function updateCurrentUser(data: {
  name: string;
  email: string;
  cpf: string;
}): Promise<UserEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/users/update`, {
    method: "PUT",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleHttpError(response, "Não foi possível atualizar seu perfil");
  }

  return response.json();
}

export async function getCurrentUserPhoto(): Promise<string | null> {
  const response = await fetch(`${env.WEB_BASE_URL}/files/users/profile-pic`, {
    headers: authHeaders(),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    await handleHttpError(response, "Não foi possível carregar sua foto");
  }

  const data = (await response.json()) as ProfilePhotoResponse;
  return data.url;
}

export async function uploadCurrentUserPhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${env.WEB_BASE_URL}/files/users/profile-pic`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!response.ok) {
    await handleHttpError(response, "Não foi possível atualizar sua foto");
  }

  const data = (await response.json()) as ProfilePhotoResponse;
  return data.url;
}
