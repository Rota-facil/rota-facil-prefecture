import { ArrowUpRight } from "lucide-react";
import PhotoWithNameAndDescriptions from "@/components/atom/PhotoWithNameAndDescriptions";
import StatusBar from "@/components/atom/statusBar";

export default function TripsInRealTime() {
  const tripStatus = ["inRoute", "embarking", "waiting", "cancelled"] as const;

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

        <div
          className={
            "flex justify-center items-center gap-2 cursor-pointer text-blue-900 text-[0.9rem]"
          }
        >
          <p>Ver todas</p>
          <ArrowUpRight color={"blue"} size={20} />
        </div>
      </div>

      <div className={"flex flex-col gap-10"}>
        {tripStatus.map((ts) => (
          <div key={ts} className={"flex justify-between cursor-pointer"}>
            <div>
              <PhotoWithNameAndDescriptions size={"sm"} />
            </div>

            <div>
              <StatusBar variant={ts} size={"sm"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
