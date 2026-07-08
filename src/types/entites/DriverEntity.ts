import { BusEntity, type BusOperationStatus } from "@/types/entites/BusEntity";
import type { PrefectureEntity } from "@/types/entites/PrefectureEntity";
import type { UserEntity } from "@/types/entites/UserEntity";
import type { DriverStatus } from "@/types/enums/DriverStatus";

export interface DriverBusEntity {
  id: string | number;
  prefectureId: string | number;
  capacity: number;
  plate: string;
  status?: BusOperationStatus;
  createdAt?: Date;
}

export interface DriverEntity {
  id: string;
  name: string;
  initials: string;
  score: number;
  completedTrips: number;
  status: DriverStatus;
  prefecture: PrefectureEntity;
  cpf: string;
  email: string;
  createdAt: string;
  bus?: DriverBusEntity;
  documentationStatus: string;
}
