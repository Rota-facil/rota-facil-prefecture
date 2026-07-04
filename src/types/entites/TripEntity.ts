import type { BusEntity } from "@/types/entites/BusEntity";
import type { TripStatusEntity } from "@/types/entites/TripStatusEntity";
import type { Progress } from "@/types/enums/Progress";

export interface TripRoutePointEntity {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface TripRouteEntity {
  id: string;
  code: string;
  name: string;
  shift: string;
  going: string;
  return_: string;
  goingFinish: string;
  returnFinish: string;
  institutions: TripRoutePointEntity[];
  boardPoints: TripRoutePointEntity[];
}

export interface TripEntity {
  id: string;
  code: string;
  prefectureId: string;
  name: string;
  reasonOfCancellation?: string;
  bus: BusEntity;
  route: TripRouteEntity;
  actualStatus: Progress;
  students: number;
  expectedStudents: number;
  latitude: number;
  longitude: number;
  createdAt: Date;
  startedAtLabel: string;
  tripStatus: TripStatusEntity[];
  ignoredInstitutions?: TripRoutePointEntity[];
  ignoredBoardPoints?: TripRoutePointEntity[];
}
