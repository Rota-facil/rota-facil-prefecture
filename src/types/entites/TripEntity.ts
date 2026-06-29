import type { BusEntity } from "@/types/entites/BusEntity";
import type { TripStatusEntity } from "@/types/entites/TripStatusEntity";
import type { Progress } from "@/types/enums/Progress";

export interface TripEntity {
  id: string;
  prefectureId: string;
  name: string;
  reasonOfCancellation: string;
  bus: BusEntity;
  actualStatus: Progress;
  students: number;
  latitude: number;
  longitude: number;
  createdAt: Date;
  tripStatus: TripStatusEntity[];
}
