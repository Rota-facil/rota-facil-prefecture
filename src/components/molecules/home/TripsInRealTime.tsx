import { ArrowUpRight, Bus, MapPinned, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import StatusBar from "@/components/atom/statusBar";
import {
  buildOpenStreetMapHtml,
  hasValidCoordinates,
  MapLegend,
} from "@/components/molecules/trips/TripProgressModal";
import { Button } from "@/components/ui/button";
import { useActiveTrips } from "@/hooks/UseTrips";
import type { TripEntity } from "@/types/entites/TripEntity";
import { Progress, ProgressMap } from "@/types/enums/Progress";

interface TripsInRealTimeProps {
  onSelectTrip: (trip: TripEntity) => void;
}

const ACTIVE_PROGRESS = new Set<Progress>([
  Progress.STARTED,
  Progress.STARTED_FINISHED,
  Progress.RETURN_STARTED,
  Progress.INSTITUTION_ARRIVAL,
  Progress.BOARD_POINT_ARRIVAL,
]);

export default function TripsInRealTime({
  onSelectTrip,
}: TripsInRealTimeProps) {
  const router = useRouter();
  const trips = useActiveTrips(15_000).trips;
  const activeTrips = useMemo(
    () => trips?.filter((trip) => ACTIVE_PROGRESS.has(trip.actualStatus)) ?? [],
    [trips],
  );
  const [selectedTripId, setSelectedTripId] = useState<string>();

  useEffect(() => {
    if (!activeTrips.some((trip) => trip.id === selectedTripId)) {
      setSelectedTripId(activeTrips[0]?.id);
    }
  }, [activeTrips, selectedTripId]);

  const selectedTrip =
    activeTrips.find((trip) => trip.id === selectedTripId) ?? activeTrips[0];

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow shadow-soft">
      <header className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
              <MapPinned className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-xl">Operação ao vivo</h3>
              <p className="text-muted-foreground text-xs">
                {activeTrips.length} viagem(ns) em acompanhamento
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 text-[0.9rem] font-semibold text-blue-900"
          onClick={() => router.push("/trips")}
        >
          Ver todas
          <ArrowUpRight size={18} />
        </button>
      </header>

      {trips === undefined ? (
        <div className="grid flex-1 animate-pulse gap-4 p-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="min-h-64 rounded-2xl bg-slate-100" />
          <div className="space-y-3">
            <div className="h-24 rounded-2xl bg-slate-100" />
            <div className="h-24 rounded-2xl bg-slate-100" />
          </div>
        </div>
      ) : selectedTrip ? (
        <div className="grid min-h-0 flex-1 gap-4 p-5 lg:grid-cols-[1.45fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-[#E5EAF0] bg-slate-100">
            <iframe
              key={selectedTrip.id}
              title={`Mapa operacional da viagem ${selectedTrip.code}`}
              srcDoc={buildOpenStreetMapHtml(selectedTrip)}
              className="h-[250px] w-full border-0"
            />
            <MapLegend
              showBus={hasValidCoordinates(
                selectedTrip.latitude,
                selectedTrip.longitude,
              )}
            />
          </div>

          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
            {activeTrips.map((trip) => {
              const selected = trip.id === selectedTrip.id;
              return (
                <button
                  key={trip.id}
                  type="button"
                  className={`rounded-2xl border p-4 text-left transition ${
                    selected
                      ? "border-blue-300 bg-blue-50/70 shadow-sm"
                      : "border-border/70 bg-white hover:border-blue-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedTripId(trip.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {trip.name || trip.route.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {trip.route.name} •{" "}
                        {trip.bus.driver?.name ?? "Sem motorista"} •{" "}
                        {trip.bus.plate}
                      </p>
                    </div>
                    <StatusBar
                      variant={ProgressMap[trip.actualStatus].value}
                      size="xsm"
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" /> {trip.students} alunos
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bus className="h-3.5 w-3.5" /> {trip.code}
                    </span>
                  </div>
                </button>
              );
            })}

            <Button
              type="button"
              className="mt-auto w-full cursor-pointer rounded-xl bg-[#1E3A8A] hover:bg-[#172d6b]"
              onClick={() => onSelectTrip(selectedTrip)}
            >
              <MapPinned className="h-4 w-4" />
              Acompanhar no mapa
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <MapPinned className="h-7 w-7" />
          </span>
          <div>
            <p className="font-semibold text-slate-800">
              Nenhuma viagem em andamento
            </p>
            <p className="mt-1 text-sm text-slate-500">
              O mapa será exibido quando uma viagem for iniciada.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
