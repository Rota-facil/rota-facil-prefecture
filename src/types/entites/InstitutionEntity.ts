export interface InstitutionRouteEntity {
  id: string;
  code: string;
  name: string;
  shift: string;
}

export interface InstitutionEntity {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  routeCount: number;
  routes: InstitutionRouteEntity[];
}
