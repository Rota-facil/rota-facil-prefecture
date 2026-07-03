export type RouteShift = "MORNING" | "AFTERNOON" | "NIGHT";

export type RouteDayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface CreateBoardPointRouteRequest {
  boardPointId: string;
  boardTimeGoing: string;
  boardTimeFinish: string;
}

export interface CreateRouteRequest {
  shift: RouteShift;
  name: string;
  going: string;
  return_: string;
  goingFinish: string;
  returnFinish: string;
  daysOfWeek: RouteDayOfWeek[];
  institutionsIds: string[];
  busIds: string[];
  boardPoints: CreateBoardPointRouteRequest[];
}

export type UpdateRouteRequest = CreateRouteRequest;
