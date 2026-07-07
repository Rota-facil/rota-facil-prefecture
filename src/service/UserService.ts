import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import type { DriverEntity } from "@/types/entites/DriverEntity";
import type { UserEntity } from "@/types/entites/UserEntity";
import type { CreateDriverRequest } from "@/types/request/CreateDriverRequest";
import type { UpdateDriverInfoRequest } from "@/types/request/UpdateDriverInfoRequest";

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

export async function listDrivers(): Promise<DriverEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/transports/users/drivers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao listar motoristas");
  }

  return response.json();
}

export async function createNewDriver(
  createDriver: CreateDriverRequest,
): Promise<DriverEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/auth/driver/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(createDriver),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar motorista");
  }

  return response.json();
}

export async function updateDriverInfo(
  driverId: string,
  updateDriver: UpdateDriverInfoRequest,
): Promise<void> {
  await fetch(`${env.WEB_BASE_URL}/auth/driver/${driverId}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updateDriver),
  });
}

export async function deactivateDriver(driverId: string) {
  await fetch(`${env.WEB_BASE_URL}/auth/driver/${driverId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
