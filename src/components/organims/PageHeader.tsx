"use client";

import { usePathname } from "next/navigation";
import NotificationPanel from "@/components/molecules/home/NotificationPanel";
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
    "/audit": "Auditoria",
    "/report": "Relatórios",
  };

  const usePathName = usePathname();

  const currentTitle =
    panelTitles[usePathName as keyof typeof panelTitles] ?? "Rota Fácil";

  return (
    <header className="sticky top-0 z-[70] flex h-16 w-full items-center gap-3 border-b bg-white px-4">
      <SidebarTrigger
        variant={"outline"}
        className={"h-8 w-8 cursor-pointer"}
        size={"lg"}
      />
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

      <NotificationPanel />
    </header>
  );
}
