import { env } from "@/config/env";
import { getToken } from "@/service/auth/TokenService";
import { handleHttpError } from "@/service/HttpErrorService";
import type {
  TripEntity,
  TripRoutePointEntity,
} from "@/types/entites/TripEntity";
import type { Progress } from "@/types/enums/Progress";
import type { PageResponse } from "@/types/response/PageResponse";

interface SpringPageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface TripPointResponse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface TripResponse {
  id: string;
  name: string;
  reasonOfCancellation?: string | null;
  students: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  actualStatus: Progress;
  bus: {
    id: string;
    prefectureId: string;
    capacity: number;
    plate: string;
    driver?: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
  route: {
    id: string;
    name: string;
    shift: string;
    going: string;
    return_: string;
    goingFinish: string;
    returnFinish: string;
    institutions: TripPointResponse[];
    boardPoints: TripPointResponse[];
  };
  tripStatus: Array<{
    id: string;
    progress: Progress;
    delay: string;
    description: string;
    createdAt: string;
  }>;
}

function mapPoint(point: TripPointResponse): TripRoutePointEntity {
  return {
    id: point.id,
    name: point.name,
    latitude: point.latitude,
    longitude: point.longitude,
  };
}

function formatTripDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function mapTrip(response: TripResponse): TripEntity {
  return {
    id: response.id,
    code: `V-${response.id.slice(0, 4).toUpperCase()}`,
    prefectureId: response.bus.prefectureId,
    name: response.name,
    reasonOfCancellation: response.reasonOfCancellation ?? undefined,
    bus: {
      id: response.bus.id,
      prefectureId: response.bus.prefectureId,
      capacity: response.bus.capacity,
      plate: response.bus.plate,
      createdAt: new Date(),
      driver: response.bus.driver
        ? {
            id: response.bus.driver.id,
            name: response.bus.driver.name,
            email: response.bus.driver.email,
            cpf: "",
            prefecture: { id: response.bus.prefectureId, name: "" },
          }
        : null,
    },
    route: {
      id: response.route.id,
      code: `R-${response.route.id.slice(0, 4).toUpperCase()}`,
      name: response.route.name,
      shift: response.route.shift,
      going: response.route.going.slice(0, 5),
      return_: response.route.return_.slice(0, 5),
      goingFinish: response.route.goingFinish.slice(0, 5),
      returnFinish: response.route.returnFinish.slice(0, 5),
      institutions: response.route.institutions.map(mapPoint),
      boardPoints: response.route.boardPoints.map(mapPoint),
    },
    actualStatus: response.actualStatus,
    students: response.students,
    expectedStudents: response.bus.capacity,
    latitude: response.latitude,
    longitude: response.longitude,
    createdAt: new Date(response.createdAt),
    startedAtLabel: formatTripDate(response.createdAt),
    tripStatus: response.tripStatus.map((status) => ({
      id: status.id,
      progress: status.progress,
      delay: status.delay,
      description: status.description,
      createdAt: new Date(status.createdAt),
    })),
  };
}

export async function listActiveTrips(): Promise<TripEntity[]> {
  const response = await fetch(`${env.WEB_BASE_URL}/transports/trips/active`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar viagens em andamento");
  }

  const data = (await response.json()) as TripResponse[];
  return data.map(mapTrip);
}

export async function listTrips(
  page: number,
  size: number,
): Promise<PageResponse<TripEntity>> {
  const response = await fetch(
    `${env.WEB_BASE_URL}/transports/trips?page=${page}&size=${size}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    await handleHttpError(response, "Erro ao listar viagens");
  }

  const data = (await response.json()) as SpringPageResponse<TripResponse>;

  return {
    content: data.content.map(mapTrip),
    page: {
      size: data.size,
      number: data.number,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
    },
  };
}
