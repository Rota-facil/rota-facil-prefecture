"use client";

import ButtonWithIcon from "@/components/atom/ButtonWithIcon";
import StatusBar from "@/components/atom/statusBar";
import { useCurrentUser } from "@/hooks/UseCurrentUser";

type PrefectureHomeHeroProps = {
  tripsStarted?: number;
  percentPointTrips?: number;
  studentsServed?: number;
};

export default function PrefectureHomeHero(props: PrefectureHomeHeroProps) {
  const { user } = useCurrentUser();
  const hour = new Date().getHours();

  console.log(props.tripsStarted);
  console.log(props.percentPointTrips);
  console.log(props.studentsServed);
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  return (
    <div
      className={
        "flex flex-col w-full gap-2 p-8 h-50 font-medium rounded-3xl bg-blue-700 bg-gradient-mesh opacity-100 text-white"
      }
    >
      <StatusBar variant={"progress"} />

      <h1 className={"font-bold text-4xl"}>
        {greeting}, {user?.prefecture.name ?? "prefeitura"}! 👋
      </h1>

      <div className={"flex justify-between"}>
        <div className={"w-7/12"}>
          <p>
            {`${props.tripsStarted ?? "0"} viagens em andamento agora, ${props.percentPointTrips ?? "0"}% das viagens no horário e ${props.studentsServed ?? "0"}
            alunos atendidos hoje pelo transporte escolar municipal.`}
          </p>
        </div>
        <div className={"flex items-center justify-center gap-5"}>
          <ButtonWithIcon typeButton={"predictiveAnalytic"} />
          <ButtonWithIcon typeButton={"dailyReport"} />
        </div>
      </div>
    </div>
  );
}
