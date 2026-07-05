import type { RouteEntity } from "@/types/entites/RouteEntity";

export interface HeatMapEntity {
  id: string;
  route: RouteEntity;
  preSignedUrlHeatMap: string;
  createdAtLabel: string;
  pointsCount: number;
}
