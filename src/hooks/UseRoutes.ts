import { useEffect, useState } from "react";
import { listRoutes } from "@/service/RouteService";
import type { RouteEntity } from "@/types/entites/RouteEntity";
import type { PageResponse } from "@/types/response/PageResponse";

export function useRoutes(page: number = 0, size: number = 8) {
  const [loading, setLoading] = useState(true);
  const [pageRoutes, setPageRoutes] =
    useState<PageResponse<RouteEntity> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function listRoutesFromService() {
      try {
        setError(null);
        setLoading(true);

        const data = await listRoutes(page, size);
        setPageRoutes(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
    listRoutesFromService();
  }, [page, size]);

  return {
    loading,
    pageRoutes,
    error,
  };
}
