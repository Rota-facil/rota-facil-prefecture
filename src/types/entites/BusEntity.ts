import type { UserEntity } from "@/types/entites/UserEntity";

export type BusOperationStatus = "OUT_OF_OPERATION" | "OPERATION";

export interface BusEntity {
  id: string | number;
  prefectureId: string | number;
  driver?: UserEntity | null;
  capacity: number;
  plate: string;
  status?: BusOperationStatus;
  active?: boolean;
  createdAt: Date;
}
