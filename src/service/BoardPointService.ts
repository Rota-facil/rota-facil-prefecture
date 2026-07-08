import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type { BoardPointEntity } from "@/types/entites/BoardPointEntity";
import type { CreateBoardPointRequest } from "@/types/request/BoardPointRequest";
import type { PageResponse } from "@/types/response/PageResponse";

interface BoardPointResponse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt?: string;
}

function mapBoardPoint(response: BoardPointResponse): BoardPointEntity {
  return {
    id: response.id,
    name: response.name,
    latitude: response.latitude,
    longitude: response.longitude,
    createdAtLabel: response.createdAt ? "Cadastrado" : "Cadastrado",
    routeCount: 0,
  };
}

export async function listBoardPoints(
  page: number,
  size: number,
): Promise<PageResponse<BoardPointEntity>> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/places/board-points?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar pontos de embarque");
  }

  const data = (await response.json()) as PageResponse<BoardPointResponse>;

  return {
    ...data,
    content: data.content.map(mapBoardPoint),
  };
}

export async function createBoardPoint(
  request: CreateBoardPointRequest,
): Promise<BoardPointEntity> {
  const response = await fetch(`${env.WEB_BASE_URL}/places/board-points`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao criar ponto de embarque");
  }

  return mapBoardPoint(await response.json());
}

export async function updateBoardPoint(
  boardPointId: string,
  request: CreateBoardPointRequest,
): Promise<BoardPointEntity> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/places/board-points/${boardPointId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao atualizar ponto de embarque");
  }

  return mapBoardPoint(await response.json());
}

export async function deleteBoardPoint(boardPointId: string): Promise<void> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/places/board-points/${boardPointId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao excluir ponto de embarque");
  }
}
