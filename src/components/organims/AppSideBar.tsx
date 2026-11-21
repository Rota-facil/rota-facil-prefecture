"use client";

import {
  Activity,
  BrainCircuit,
  Building2,
  ClipboardList,
  FileDown,
  Flame,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  LogOut,
  PinIcon,
  Plane,
  Route,
  ShieldCheck,
  TruckIcon,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { getGrafanaUrl } from "@/config/env";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import { removeToken } from "@/service/auth/TokenService";

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useCurrentUser();

  if (user?.role === "SUPERUSER") {
    return <SuperuserSidebar state={state} user={user} />;
  }

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
              <MySideBarMenuButton href={"/vehicles"}>
                <TruckIcon />
                <span>Veículos</span>
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

            {String(user?.role) === "SUPERUSER" && (
              <SidebarMenuItem>
                <MySideBarMenuButton href="/prefecture-applications">
                  <ClipboardList />
                  <span>Solicitações de adesão</span>
                </MySideBarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <MySideBarMenuButton href={"/report"}>
                <FileDown />
                <span>Relatórios</span>
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
            <Link
              href="/profile"
              aria-label="Abrir meu perfil"
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
            </Link>

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

function SuperuserSidebar({
  state,
  user,
}: {
  state: "expanded" | "collapsed";
  user: NonNullable<ReturnType<typeof useCurrentUser>["user"]>;
}) {
  return (
    <Sidebar collapsible="icon" variant="sidebar" className="transition-all">
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-start">
          <Image
            src="/icon-rota-facil-2.png"
            alt="Ícone Rota Fácil"
            width={75}
            height={75}
            className="shrink-0"
          />
          {state === "expanded" && (
            <div className="mb-2 flex flex-col">
              <span className="text-lg font-bold">Rota Fácil</span>
              <span className="text-xs uppercase text-muted-foreground">
                Gestão interna
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold">
              Visão geral
            </SidebarGroupLabel>
            <SidebarMenuItem>
              <MySideBarMenuButton href="/superuser">
                <LayoutDashboard />
                <span>Dashboard</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold">
              Ecossistema
            </SidebarGroupLabel>
            <SidebarMenuItem>
              <MySideBarMenuButton href="/prefecture-applications">
                <ClipboardList />
                <span>Solicitações</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MySideBarMenuButton href="/superuser/prefectures">
                <Landmark />
                <span>Prefeituras</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold">
              Governança
            </SidebarGroupLabel>
            <SidebarMenuItem>
              <MySideBarMenuButton href="/audit">
                <ShieldCheck />
                <span>Auditoria</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <MySideBarMenuButton href={getGrafanaUrl()} external>
                <Activity />
                <span>Observabilidade</span>
              </MySideBarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div
          className={`flex items-center p-2 ${state === "collapsed" ? "justify-center" : "justify-between"}`}
        >
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              aria-label="Abrir meu perfil"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-cyan-500 font-semibold text-white transition hover:ring-4 hover:ring-blue-100"
            >
              {user.name[0]?.toUpperCase() ?? "R"}
            </Link>
            {state === "expanded" && (
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">
                  {user.name}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  Gestor Rota Fácil
                </span>
              </div>
            )}
          </div>
          {state === "expanded" && (
            <LogOut
              className="h-3.5 w-3.5 cursor-pointer text-muted-foreground hover:text-foreground"
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
