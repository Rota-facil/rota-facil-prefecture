import type { UserEntity } from "@/types/entites/UserEntity";

export interface BusEntity {
  id: number;
  prefectureId: number;
  driver: UserEntity;
  capacity: number;
  plate: string;
  createdAt: Date;
}
