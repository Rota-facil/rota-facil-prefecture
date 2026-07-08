import { env } from "@/config/env";
import { handleHttpError } from "@/service/HttpErrorService";
import type { AuthLoginRequest } from "@/types/request/auth/AuthLoginRequest";
import type { AuthLoginResponse } from "@/types/response/auth/AuthLoginResponse";

export async function login(
  authLoginRequest: AuthLoginRequest,
): Promise<AuthLoginResponse> {
  const response = await fetch(`${env.WEB_BASE_URL}/auth/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authLoginRequest),
  });

  if (!response.ok) {
    await handleHttpError(response, "Credenciais inválidas");
  }

  return response.json();
}
