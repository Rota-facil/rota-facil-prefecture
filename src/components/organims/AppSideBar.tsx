"use client";

import {
  BrainCircuit,
  Building2,
  BusIcon,
  FileText,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PinIcon,
  Plane,
  Route,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MySideBarMenuButton from "@/components/atom/MySideBarMenuButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { removeToken } from "@/service/auth/TokenService";

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useCurrentUser();
  const router = useRouter();

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

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/audit"}>
                <ShieldCheck />
                <span>Auditoria</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t transition-all">
        <div
          className={`flex items-center p-2 ${state === "collapsed" ? "justify-center" : "justify-between"}`}
        >
          <div className="flex items-center gap-3">
            <div
              className="
          flex
          h-8.5
          w-8.5
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br from-blue-700 to-blue-500
          text-white
          font-semibold
        "
            >
              {user?.name[0].toUpperCase() ?? "P"}
            </div>

            {state === "expanded" && (
              <div className="flex flex-col">
                <span className="font-semibold text-[14px]">
                  {user?.prefecture.name ?? "Prefeitura"}
                </span>

                <span className="text-[11px] text-muted-foreground">
                  {user?.email ?? "email@gmail.com"}
                </span>
              </div>
            )}
          </div>

          {state === "expanded" && (
            <LogOut
              className="
          h-3.5
          w-3.5
          cursor-pointer
          text-muted-foreground
          hover:text-foreground
        "
              onClick={() => {
                removeToken();
                window.location.reload();
              }}
            />
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
