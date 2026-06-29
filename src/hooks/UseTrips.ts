import { useEffect, useState } from "react";
import { listTrips } from "@/service/TripService";
import type { TripEntity } from "@/types/entites/TripEntity";
import type { PageResponse } from "@/types/response/PageResponse";

export function useTrips(page: number = 0, size: number = 4) {
  const [tripPage, setTripPage] = useState<PageResponse<TripEntity> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function listTripsFromService() {
      try {
        setLoading(true);

        const data = await listTrips(page, size);
        setTripPage(data);
        setError(null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
    listTripsFromService();
  }, [page, size]);

  return {
    tripPage,
    loading,
    error,
  };
}
