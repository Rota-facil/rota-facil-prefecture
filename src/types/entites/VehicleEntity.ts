import type { UserEntity } from "@/types/entites/UserEntity";

export type VehicleOperationStatus = "OUT_OF_OPERATION" | "OPERATION";
export type VehicleType = "BUS" | "CAR" | "VAN";

export interface VehicleEntity {
  id: string | number;
  prefectureId: string | number;
  driver?: UserEntity | null;
  capacity: number;
  plate: string;
  status?: VehicleOperationStatus;
  active?: boolean;
  vehicleType?: VehicleType;
  createdAt: Date;
}
