import type { PrefectureEntity } from "@/types/entites/PrefectureEntity";
import type { UserEntity } from "@/types/entites/UserEntity";
import type { VehicleEntity } from "@/types/entites/VehicleEntity";
import type { DriverStatus } from "@/types/enums/DriverStatus";

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
  vehicle?: VehicleEntity | null;
  documentationStatus: string;
}
