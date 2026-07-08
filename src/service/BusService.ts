import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { BusEntity } from "@/types/entites/BusEntity";
import type { CreateBusRequest } from "@/types/request/CreateBusRequest";
import type { UpdateBusOfDriverRequest } from "@/types/request/UpdateBusOfDriverRequest";
import type { UpdateBusRequest } from "@/types/request/UpdateBusRequest";

export async function listBus(): Promise<BusEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/transports/bus`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar ônibus");
  }

  return response.json();
}

export async function createBus(request: CreateBusRequest): Promise<BusEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/transports/bus/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao registrar ônibus");
  }
  return response.json();
}

export async function updateBus(
  busId: string | number,
  request: UpdateBusRequest,
): Promise<BusEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/transports/bus/${busId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao atualizar ônibus");
  }

  return response.json();
}

export async function deleteBus(busId: string | number): Promise<void> {
  const response = await fetch(`${env.WEB_BASE_URL}/transports/bus/${busId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao excluir ônibus");
  }
}

export async function changeBusDriver(
  driverId: string,
  request: UpdateBusOfDriverRequest,
): Promise<void> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/users/drivers/${driverId}/bus/change`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao alterar ônibus do motorista");
  }
}
