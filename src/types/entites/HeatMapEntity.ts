import type { RouteEntity } from "@/types/entites/RouteEntity";

export interface HeatMapEntity {
  id: string;
  route: RouteEntity;
  preSignedUrlHeatMap: string;
  createdAtLabel: string;
  createdAt?: Date;
  pointsCount: number;
}
