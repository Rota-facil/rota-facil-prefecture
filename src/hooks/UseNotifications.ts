import { useEffect, useState } from "react";
import { listMyNotifications } from "@/service/NotificationService";
import type { NotificationEntity } from "@/types/entites/NotificationEntity";
import type { PageResponse } from "@/types/response/PageResponse";

export function UseNotifications(page: number = 0, size: number = 4) {
  const [notificationsPage, setNotificationsPage] =
    useState<PageResponse<NotificationEntity> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function listMyNotificationsFromService() {
      try {
        setLoading(true);

        const data = await listMyNotifications(page, size);
        setNotificationsPage(data);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
    listMyNotificationsFromService();
  }, [page, size]);

  return {
    notificationsPage,
    loading,
    error,
  };
}
