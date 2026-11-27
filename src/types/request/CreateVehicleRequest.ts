import type { VehicleType } from "@/types/entites/VehicleEntity";

export interface CreateVehicleRequest {
  driverId?: string | null;
  capacity: number;
  plate: string;
  vehicleType: VehicleType;
}
