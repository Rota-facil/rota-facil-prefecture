import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { DriverEntity } from "@/types/entites/DriverEntity";
import type { StudentEntity } from "@/types/entites/StudentEntity";
import type { UserEntity } from "@/types/entites/UserEntity";
import type { CreateDriverRequest } from "@/types/request/CreateDriverRequest";
import type { UpdateDriverInfoRequest } from "@/types/request/UpdateDriverInfoRequest";
import type { PageResponse } from "@/types/response/PageResponse";

interface StudentResponse {
  id: string;
  name: string;
  email: string;
  active: boolean;
  completedTrips: number;
  trips: number;
  score: number;
}

function calculateFrequency(completedTrips: number, trips: number): number {
  if (trips <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((completedTrips / trips) * 100));
}

function mapStudent(response: StudentResponse): StudentEntity {
  return {
    id: response.id,
    code: `A-${response.id.slice(0, 4).toUpperCase()}`,
    name: response.name,
    email: response.email,
    frequency: calculateFrequency(response.completedTrips, response.trips),
    score: response.score,
    status: response.active ? "ACTIVE" : "INACTIVE",
    completedTrips: response.completedTrips,
    trips: response.trips,
  };
}

export async function getCurrentUser(): Promise<UserEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao buscar usuário");
  }

  return response.json();
}

export async function listStudents(
  page: number,
  size: number,
): Promise<PageResponse<StudentEntity>> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/auth/students?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar alunos");
  }

  const data = (await response.json()) as PageResponse<StudentResponse>;

  return {
    ...data,
    content: data.content.map(mapStudent),
  };
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
    await handleHttpError(response, "Erro ao listar motoristas");
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
    await handleHttpError(response, "Erro ao criar motorista");
  }

  return response.json();
}

export async function updateDriverInfo(
  driverId: string,
  updateDriver: UpdateDriverInfoRequest,
): Promise<void> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/auth/driver/${driverId}/update`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updateDriver),
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao atualizar motorista");
  }
}

export async function deactivateDriver(driverId: string) {
  const response = await fetch(
    `${env.WEB_BASE_URL}/auth/driver/${driverId}/delete`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao desativar motorista");
  }
}
