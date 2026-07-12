import { useEffect, useState } from "react";
import { listTrips } from "@/service/TripService";
import type { TripEntity } from "@/types/entites/TripEntity";
import type { PageResponse } from "@/types/response/PageResponse";

export function useTrips(
  page: number = 0,
  size: number = 4,
  refreshInterval?: number,
) {
  const [tripPage, setTripPage] = useState<PageResponse<TripEntity> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    async function listTripsFromService(showLoading: boolean) {
      try {
        if (showLoading) setLoading(true);

        const data = await listTrips(page, size);
        if (!active) return;
        setTripPage(data);
        setError(null);
      } catch (e) {
        if (active) setError(e as Error);
      } finally {
        if (active && showLoading) setLoading(false);
      }
    }

    void listTripsFromService(true);
    const interval = refreshInterval
      ? window.setInterval(
          () => void listTripsFromService(false),
          refreshInterval,
        )
      : undefined;

    return () => {
      active = false;
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [page, refreshInterval, size]);

  return {
    tripPage,
    loading,
    error,
  };
}
