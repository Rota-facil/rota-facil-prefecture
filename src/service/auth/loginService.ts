import { env } from "@/config/env";
import type { AuthLoginRequest } from "@/types/request/auth/AuthLoginRequest";
import type { AuthLoginResponse } from "@/types/response/auth/AuthLoginResponse";

export async function login(
  authLoginRequest: AuthLoginRequest,
): Promise<AuthLoginResponse> {
  console.log(env.WEB_BASE_URL);
  const response = await fetch("${env.WEB_BASE_URL}/auth/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authLoginRequest),
  });

  if (!response.ok) {
    throw new Error("Credenciais inválidas");
  }

  return response.json();
}
