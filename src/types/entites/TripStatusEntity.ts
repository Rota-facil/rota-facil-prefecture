import type { Progress } from "@/types/enums/Progress";

export interface TripStatusEntity {
  id: string;
  progress: Progress;
  delay: string;
  description: string;
  createdAt: Date;
}
