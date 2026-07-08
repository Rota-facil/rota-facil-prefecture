import type { RouteEntity } from "@/types/entites/RouteEntity";

export interface PredictiveAnalysisEntity {
  id: string;
  route: RouteEntity;
  interpretation: string;
  createdAtLabel: string;
  createdAt?: Date;
}
