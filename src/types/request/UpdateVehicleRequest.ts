import type { VehicleOperationStatus } from "@/types/entites/VehicleEntity";

export interface UpdateVehicleRequest {
  driverId: string | null;
  capacity: number;
  plate: string;
  status: VehicleOperationStatus;
}
