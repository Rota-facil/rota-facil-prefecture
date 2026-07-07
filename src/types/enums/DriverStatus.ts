import type { TypeStatusBar } from "@/components/atom/statusBar";

type DriverStatusType = Extract<TypeStatusBar, "onRoute" | "available">;

export enum DriverStatus {
  ON_ROUTE = "ON_ROUTE",
  AVAILABLE = "AVAILABLE",
}

export const DriverStatusMap: Record<
  DriverStatus,
  { value: DriverStatusType }
> = {
  [DriverStatus.ON_ROUTE]: {
    value: "onRoute",
  },

  [DriverStatus.AVAILABLE]: {
    value: "available",
  },
};
