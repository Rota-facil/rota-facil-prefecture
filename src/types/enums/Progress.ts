import type { TypeStatusBar } from "@/components/atom/statusBar";

export enum Progress {
  NOT_STARTED = "NOT_STARTED",
  CANCELLED = "CANCELLED",
  STARTED = "STARTED",
  STARTED_FINISHED = "STARTED_FINISHED",
  RETURN_STARTED = "RETURN_STARTED",
  RETURN_FINISHED = "RETURN_FINISHED",
  INSTITUTION_ARRIVAL = "INSTITUTION_ARRIVAL",
  BOARD_POINT_ARRIVAL = "BOARD_POINT_ARRIVAL",
}

export const ProgressMap: Record<
  Progress,
  {
    value: TypeStatusBar;
    description: string;
  }
> = {
  [Progress.NOT_STARTED]: {
    value: "waiting",
    description: "Viagem não iniciada",
  },
  [Progress.CANCELLED]: {
    value: "canceledTrip",
    description: "Viagem cancelada",
  },
  [Progress.STARTED]: {
    value: "onRoute",
    description: "Ida iniciada",
  },
  [Progress.STARTED_FINISHED]: {
    value: "waiting",
    description: "Ida finalizada",
  },
  [Progress.RETURN_STARTED]: {
    value: "onRoute",
    description: "Retorno iniciado",
  },
  [Progress.RETURN_FINISHED]: {
    value: "available",
    description: "Retorno finalizado",
  },
  [Progress.INSTITUTION_ARRIVAL]: {
    value: "embarking",
    description: "Chegada na instituição",
  },
  [Progress.BOARD_POINT_ARRIVAL]: {
    value: "embarking",
    description: "Chegada no ponto de embarque",
  },
};
