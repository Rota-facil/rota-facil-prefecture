import type { UserEntity } from "@/types/entites/UserEntity";

export type BusOperationStatus = "operating" | "outOfOperation";

export interface BusEntity {
  id: string | number;
  prefectureId: string | number;
  driver: UserEntity;
  capacity: number;
  plate: string;
  status?: BusOperationStatus;
  createdAt: Date;
}
