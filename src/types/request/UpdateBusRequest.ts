import type { BusOperationStatus } from "@/types/entites/BusEntity";

export interface UpdateBusRequest {
  driverId: string | null;
  capacity: number;
  plate: string;
  status: BusOperationStatus;
}
