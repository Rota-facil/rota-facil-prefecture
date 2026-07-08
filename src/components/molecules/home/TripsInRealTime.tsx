import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import PhotoWithNameAndDescriptions from "@/components/atom/PhotoWithNameAndDescriptions";
import StatusBar from "@/components/atom/statusBar";
import { useTrips } from "@/hooks/UseTrips";
import type { TripEntity } from "@/types/entites/TripEntity";
import { ProgressMap } from "@/types/enums/Progress";

interface TripsInRealTimeProps {
  onSelectTrip: (trip: TripEntity) => void;
}

export default function TripsInRealTime({
  onSelectTrip,
}: TripsInRealTimeProps) {
  const router = useRouter();
  const tripStatus = ["inRoute", "embarking", "waiting", "cancelled"] as const;
  const trips = useTrips().tripPage?.content;
  let tripCount = 1;
  return (
    <div
      className={
        "flex flex-col  p-7 w-5/7 gap-8 border bg-card text-card-foreground shadow rounded-2xl border-border/70 shadow-soft h-full"
      }
    >
      <div className={"flex justify-between"}>
        <div>
          <h3 className={"font-bold text-xl"}>Viagens em tempo real</h3>

          <p className={"text-muted-foreground text-xs"}>
            Atualizado a pouco tempo
          </p>
        </div>

        <button
          type="button"
          className={
            "flex justify-center items-center gap-2 cursor-pointer text-blue-900 text-[0.9rem]"
          }
          onClick={() => router.push("/trips")}
        >
          <p>Ver todas</p>
          <ArrowUpRight color={"blue"} size={20} />
        </button>
      </div>

      <div className={"flex flex-col gap-10"}>
        {trips === undefined
          ? tripStatus.map((ts) => (
              <div key={ts} className={"flex justify-between cursor-pointer"}>
                <div>
                  <PhotoWithNameAndDescriptions size={"sm"} />
                </div>

                <div>
                  <StatusBar variant={ts} size={"sm"} />
                </div>
              </div>
            ))
          : trips.map((trip) => (
              <button
                key={trip.id}
                type="button"
                className={"flex justify-between cursor-pointer text-left"}
                onClick={() => onSelectTrip(trip)}
              >
                <div>
                  <PhotoWithNameAndDescriptions
                    photo={`${trip.name[0].toUpperCase()}-${tripCount++}`}
                    title={trip.name}
                    description={`${trip.bus.driver?.name ?? "Sem motorista"} • ${trip.students} alunos`}
                    size={"sm"}
                  />
                </div>

                <div>
                  <StatusBar
                    variant={ProgressMap[trip.actualStatus].value}
                    size={"sm"}
                  />
                </div>
              </button>
            ))}
      </div>
    </div>
  );
}
