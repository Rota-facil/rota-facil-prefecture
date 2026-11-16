import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { VehicleEntity } from "@/types/entites/VehicleEntity";
import type { CreateVehicleRequest } from "@/types/request/CreateVehicleRequest";
import type { UpdateVehicleOfDriverRequest } from "@/types/request/UpdateVehicleOfDriverRequest";
import type { UpdateVehicleRequest } from "@/types/request/UpdateVehicleRequest";

export async function listVehicles(): Promise<VehicleEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/vehicles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar veículos");
  }

  return response.json();
}

export async function createVehicle(
  request: CreateVehicleRequest,
): Promise<VehicleEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao registrar veículo");
  }
  return response.json();
}

export async function updateVehicle(
  vehicleId: string | number,
  request: UpdateVehicleRequest,
): Promise<VehicleEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/vehicles/${vehicleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao atualizar veículo");
  }

  return response.json();
}

export async function deleteVehicle(vehicleId: string | number): Promise<void> {
  const response = await fetch(`${env.WEB_BASE_URL}/vehicles/${vehicleId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao excluir veículo");
  }
}

export async function updateVehicleDriver(
  driverId: string,
  request: UpdateVehicleOfDriverRequest,
): Promise<void> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/vehicles/${request.vehicleId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ driverId }),
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao alterar motorista do veículo");
  }
}

export async function getVehicleByDriver(
  driverId: string,
): Promise<VehicleEntity | null> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/vehicles/drivers/${driverId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (response.status === 404) return null;
  if (!response.ok) await handleHttpError(response, "Erro ao buscar veículo");
  return response.json();
}

export const changeVehicleDriver = updateVehicleDriver;
