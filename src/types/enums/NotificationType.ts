import type { NotificationStatus } from "@/components/atom/NotificationCard";

export enum NotificationType {
  // TRIP_STARTED = "TRIP_STARTED",

  // TRIP_FINISHED = "TRIP_FINISHED",

  TRIP_CANCELLED = "TRIP_CANCELLED",

  // STUDENT_CHECKIN = "STUDENT_CHECKIN"
}

export const NotificationMap: Record<
  NotificationType,
  {
    value: NotificationStatus;
  }
> = {
  [NotificationType.TRIP_CANCELLED]: {
    value: "canceledTrip",
  },
};
