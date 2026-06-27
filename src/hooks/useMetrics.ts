import { useEffect, useState } from "react";
import { getMetrics } from "@/service/MetricService";
import type { MetricResponse } from "@/types/response/MetricResponse";

export function useMetrics() {
  const [metrics, setMetrics] = useState<MetricResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getMetrics();
        setMetrics(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
  };
}
