"use client";

import {
  BrainCircuit,
  Building2,
  BusIcon,
  FileText,
  Flame,
  GraduationCap,
  LayoutDashboard,
  PinIcon,
  Plane,
  Route,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import MySideBarMenuButton from "@/components/atom/MySideBarMenuButton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  return (
    <Sidebar
      collapsible={"icon"}
      variant={"sidebar"}
      className={"transition-all"}
    >
      <SidebarHeader className={"border-b"}>
        <div className="flex items-center justify-start">
          <Image
            src={"/icon-rota-facil-2.png"}
            alt={"icone rota facil 2"}
            width={75}
            height={2}
            className={"shadow-glow bg-gradient-primary"}
          />

          {state === "expanded" && (
            <div className="flex flex-col mb-2">
              <span className="font-bold text-lg">Rota Fácil</span>
              <span className="text-xs text-muted-foreground uppercase">
                Prefeitura
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel className={"font-semibold"}>
              <p>Operação</p>
            </SidebarGroupLabel>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/home"}>
                <LayoutDashboard />
                <span>Dashboard</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/routes"}>
                <Route />
                <span>Rotas</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/trips"}>
                <Plane />
                <span>Viagens</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/drivers"}>
                <UsersRound />
                <span>Motoristas</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/bus"}>
                <BusIcon />
                <span>Ônibus</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/institutions"}>
                <Building2 />
                <span>Instituições</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/board-points"}>
                <PinIcon />
                <span>Ponto de embarque</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/students"}>
                <GraduationCap />
                <span>Alunos</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className={"font-semibold"}>
              Inteligência
            </SidebarGroupLabel>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/predictive-analysis"}>
                <BrainCircuit />
                <span>Análise preditiva</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/heat-map"}>
                <Flame />
                <span>Mapa de calor</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className={"font-semibold"}>
              <p>Sistema</p>
            </SidebarGroupLabel>

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/report"}>
                <FileText />
                <span>Relatórios</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
