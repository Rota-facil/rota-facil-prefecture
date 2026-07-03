import type {
  CreateBoardPointRouteRequest,
  RouteDayOfWeek,
  RouteShift,
} from "@/types/request/RouteRequest";

export type RouteStatus = "ACTIVE" | "PAUSED";

export interface RouteInstitutionEntity {
  id: string;
  name: string;
}

export interface RouteBusEntity {
  id: string;
  label: string;
}

export interface RouteBoardPointEntity extends CreateBoardPointRouteRequest {
  name: string;
}

export interface RouteEntity {
  id: string;
  code: string;
  name: string;
  shift: RouteShift;
  going: string;
  return_: string;
  goingFinish: string;
  returnFinish: string;
  daysOfWeek: RouteDayOfWeek[];
  institutions: RouteInstitutionEntity[];
  bus: RouteBusEntity[];
  boardPoints: RouteBoardPointEntity[];
  status: RouteStatus;
  updatedAtLabel: string;
}
