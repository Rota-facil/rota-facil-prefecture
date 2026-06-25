import { ArrowUpRight } from "lucide-react";
import PhotoWithNameAndDescriptions from "@/components/atom/PhotoWithNameAndDescriptions";
import StatusBar from "@/components/atom/statusBar";

export default function TripsInRealTime() {
  return (
    <div className={"flex flex-col w-4/7 gap-10"}>
      <div className={"flex justify-between"}>
        <div>
          <h3>Viagens em tempo real</h3>
          <p>Atualizado a pouco tempo</p>
        </div>

        <div className={"flex gap-2 cursor-pointer"}>
          <p>Ver todas</p>
          <ArrowUpRight color={"blue"} />
        </div>
      </div>

      <div className={"flex flex-col gap-6 cursor-pointer"}>
        <div className={"flex justify-between"}>
          <div>
            <PhotoWithNameAndDescriptions />
          </div>

          <div>
            <StatusBar
              BallColor={"green"}
              textColor={"black"}
              position={"self-start"}
            />
          </div>
        </div>

        <div className={"flex justify-between"}>
          <div>
            <PhotoWithNameAndDescriptions />
          </div>

          <div>
            <StatusBar
              BallColor={"green"}
              textColor={"black"}
              position={"self-start"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
