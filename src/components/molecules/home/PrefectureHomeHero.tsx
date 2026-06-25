import ButtonWithIcon from "@/components/atom/ButtonWithIcon";
import StatusBar from "@/components/atom/statusBar";

export default function PrefectureHomeHero() {
  return (
    <div
      className={
        "flex flex-col w-full gap-2 p-8 h-50 font-medium rounded-3xl bg-blue-700 bg-gradient-mesh opacity-100 text-white"
      }
    >
      <StatusBar variant={"progress"} />

      <h1 className={"font-bold text-4xl"}>Bom dia, prefeitura! 👋</h1>

      <div className={"flex justify-between"}>
        <div className={"w-7/12"}>
          <p>
            126 viagens em andamento agora, 27 ônibus em circulação e 2.318
            alunos atendidos hoje pelo transporte escolar municipal.
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
