"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function PageHeader() {
  const panelTitles = {
    "/home": "Dashboards",
    "/routes": "Rotas",
    "/trips": "Viagens",
    "/drivers": "Motoristas",
    "/bus": "Ônibus",
    "/institutions": "Instituições",
    "/board-points": "Pontos de embarque",
    "/students": "Alunos",
    "/predictive-analysis": "Análise preditiva",
    "/heat-map": "Mapa de calor",
  };

  const usePathName = usePathname();

  const currentTitle =
    panelTitles[usePathName as keyof typeof panelTitles] ?? "Rota Fácil";

  return (
    <header className="flex h-16 items-center border-b px-4 gap-3">
      <SidebarTrigger variant={"outline"} className={"h-8 w-8"} size={"lg"} />
      <div className={"w-[0.2px] h-6 bg-gray-300"}></div>

      <div className={"flex-col"}>
        <p
          className={
            "text-[12px] font-medium uppercase tracking-wider text-muted-foreground"
          }
        >
          Painel
        </p>
        <p className={"text-[14px] font-bold"}>{currentTitle}</p>
      </div>
    </header>
  );
}
