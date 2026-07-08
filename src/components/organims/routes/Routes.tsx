"use client";

import { AlertTriangle, Pencil, Plus, Route, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import RouteStatusBadge from "@/components/atom/RouteStatusBadge";
import TableActionButton from "@/components/atom/TableActionButton";
import DataTable, {
  type DataTableColumn,
} from "@/components/molecules/DataTable";
import RouteFilters, {
  dayLabels,
  type RouteShiftFilter,
  type RouteStatusFilter,
  shiftLabels,
} from "@/components/molecules/routes/RouteFilters";
import RouteForm from "@/components/molecules/routes/RouteForm";
import { Button } from "@/components/ui/button";
import { useRoutes } from "@/hooks/UseRoutes";
import { listBoardPoints } from "@/service/BoardPointService";
import { listBus } from "@/service/BusService";
import { listInstitutions } from "@/service/InstitutionService";
import { addRoute, listRoutes } from "@/service/RouteService";
import type { BoardPointEntity } from "@/types/entites/BoardPointEntity";
import type { BusEntity } from "@/types/entites/BusEntity";
import type { InstitutionEntity } from "@/types/entites/InstitutionEntity";
import type {
  RouteBusEntity,
  RouteEntity,
  RouteInstitutionEntity,
  RouteStatus,
} from "@/types/entites/RouteEntity";
import type { CreateRouteRequest } from "@/types/request/RouteRequest";

// const institutionOptions = [
//   { id: "11111111-1111-4111-8111-111111111111", label: "E.M. João Paulo" },
//   { id: "22222222-2222-4222-8222-222222222222", label: "E.E. Santos Dumont" },
//   { id: "33333333-3333-4333-8333-333333333333", label: "CMEI Girassol" },
//   { id: "44444444-4444-4444-8444-444444444444", label: "IFMG Campus 2" },
// ];
//
// const busOptions = [
//   { id: "55555555-5555-4555-8555-555555555555", label: "Ônibus 01" },
//   { id: "66666666-6666-4666-8666-666666666666", label: "Ônibus 02" },
//   { id: "77777777-7777-4777-8777-777777777777", label: "Ônibus 03" },
// ];
//
// const boardPointOptions = [
//   { id: "88888888-8888-4888-8888-888888888888", label: "Praça Central" },
//   { id: "99999999-9999-4999-8999-999999999999", label: "Posto Vila Nova" },
//   { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", label: "Comunidade Rural" },
//   { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", label: "Rua das Flores" },
// ];
//
// const initialRoutes: RouteEntity[] = [
//   {
//     id: "route-12",
//     code: "R-12",
//     name: "Centro -> E.M. João Paulo",
//     shift: "MORNING",
//     going: "06:30",
//     goingFinish: "07:20",
//     return_: "12:00",
//     returnFinish: "12:50",
//     daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
//     institutions: [
//       { id: institutionOptions[0].id, name: institutionOptions[0].label },
//       { id: institutionOptions[1].id, name: institutionOptions[1].label },
//     ],
//     bus: [{ id: busOptions[0].id, label: busOptions[0].label }],
//     boardPoints: [
//       {
//         boardPointId: boardPointOptions[0].id,
//         name: boardPointOptions[0].label,
//         boardTimeGoing: "06:40",
//         boardTimeFinish: "12:10",
//       },
//       {
//         boardPointId: boardPointOptions[1].id,
//         name: boardPointOptions[1].label,
//         boardTimeGoing: "06:55",
//         boardTimeFinish: "12:25",
//       },
//     ],
//     status: "ACTIVE",
//     updatedAtLabel: "Atualizada há 2 dias",
//   },
//   {
//     id: "route-08",
//     code: "R-08",
//     name: "Vila Nova -> E.E. Santos Dumont",
//     shift: "MORNING",
//     going: "06:20",
//     goingFinish: "07:10",
//     return_: "11:50",
//     returnFinish: "12:35",
//     daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
//     institutions: [
//       { id: institutionOptions[1].id, name: institutionOptions[1].label },
//     ],
//     bus: [{ id: busOptions[1].id, label: busOptions[1].label }],
//     boardPoints: [
//       {
//         boardPointId: boardPointOptions[1].id,
//         name: boardPointOptions[1].label,
//         boardTimeGoing: "06:35",
//         boardTimeFinish: "12:10",
//       },
//     ],
//     status: "ACTIVE",
//     updatedAtLabel: "Atualizada há 2 dias",
//   },
//   {
//     id: "route-04",
//     code: "R-04",
//     name: "Bairro Alto -> CMEI Girassol",
//     shift: "AFTERNOON",
//     going: "12:30",
//     goingFinish: "13:20",
//     return_: "17:00",
//     returnFinish: "17:45",
//     daysOfWeek: ["MONDAY", "WEDNESDAY", "FRIDAY"],
//     institutions: [
//       { id: institutionOptions[2].id, name: institutionOptions[2].label },
//     ],
//     bus: [{ id: busOptions[2].id, label: busOptions[2].label }],
//     boardPoints: [
//       {
//         boardPointId: boardPointOptions[3].id,
//         name: boardPointOptions[3].label,
//         boardTimeGoing: "12:45",
//         boardTimeFinish: "17:15",
//       },
//     ],
//     status: "PAUSED",
//     updatedAtLabel: "Atualizada há 2 dias",
//   },
// ];

// function resolveInstitutions(ids: string[]): RouteInstitutionEntity[] {
//   return ids.map((id) => {
//     const institution = institutionOptions.find((option) => option.id === id);
//     return { id, name: institution?.label ?? id };
//   });
// }
//
// function resolveBus(ids: string[]): RouteBusEntity[] {
//   return ids.map((id) => {
//     const busItem = busOptions.find((option) => option.id === id);
//     return { id, label: busItem?.label ?? id };
//   });
// }
//
// function resolveBoardPoints(request: CreateRouteRequest) {
//   return request.boardPoints.map((boardPoint) => {
//     const option = boardPointOptions.find(
//       (item) => item.id === boardPoint.boardPointId,
//     );
//
//     return {
//       ...boardPoint,
//       name: option?.label ?? boardPoint.boardPointId,
//     };
//   });
// }

// function createRouteFromRequest(
//   request: CreateRouteRequest,
//   status: RouteStatus,
//   id?: string,
//   code?: string,
// ): RouteEntity {
//   return {
//     id: id ?? crypto.randomUUID(),
//     code: code ?? `R-${String(Math.floor(Math.random() * 90) + 10)}`,
//     name: request.name,
//     shift: request.shift,
//     going: request.going,
//     return_: request.return_,
//     goingFinish: request.goingFinish,
//     returnFinish: request.returnFinish,
//     daysOfWeek: request.daysOfWeek,
//     institutions: resolveInstitutions(request.institutionsIds),
//     bus: resolveBus(request.busIds),
//     boardPoints: resolveBoardPoints(request),
//     status,
//     updatedAtLabel: "Atualizada agora",
//   };
// }

export default function Routes() {
  const [routes, setRoutes] = useState<RouteEntity[]>([]);
  const [shiftFilter, setShiftFilter] = useState<RouteShiftFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<RouteStatusFilter>("ALL");
  const [editingRoute, setEditingRoute] = useState<RouteEntity | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [routePendingDelete, setRoutePendingDelete] = useState<RouteEntity>();

  const filteredRoutes = useMemo(() => {
    return routes.filter((routeItem) => {
      const matchesShift =
        shiftFilter === "ALL" || routeItem.shift === shiftFilter;
      const matchesStatus =
        statusFilter === "ALL" || routeItem.status === statusFilter;

      return matchesShift && matchesStatus;
    });
  }, [routes, shiftFilter, statusFilter]);

  const columns: DataTableColumn<RouteEntity>[] = [
    {
      id: "route",
      header: "Rota",
      cell: (routeItem) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 text-xs font-bold text-white shadow-sm">
            {routeItem.code}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{routeItem.name}</p>
            <p className="text-xs text-muted-foreground">
              {routeItem.updatedAtLabel}
            </p>
          </div>
        </div>
      ),
      className: "min-w-72",
    },
    {
      id: "shift",
      header: "Turno",
      cell: (routeItem) => shiftLabels[routeItem.shift],
    },
    {
      id: "points",
      header: "Pontos",
      cell: (routeItem) => routeItem.boardPoints.length,
      className: "text-center font-medium",
      headerClassName: "text-center",
    },
    {
      id: "institutions",
      header: "Instituições",
      cell: (routeItem) => `${routeItem.institutions.length} vinculada(s)`,
    },
    {
      id: "bus",
      header: "Ônibus",
      cell: (routeItem) => routeItem.bus.length,
      className: "text-center font-medium",
      headerClassName: "text-center",
    },
    {
      id: "days",
      header: "Dias",
      cell: (routeItem) =>
        routeItem.daysOfWeek.map((day) => dayLabels[day]).join(", "),
      className: "max-w-48 text-xs text-muted-foreground",
    },
    {
      id: "status",
      header: "Status",
      cell: (routeItem) => <RouteStatusBadge status={routeItem.status} />,
      className: "text-right",
      headerClassName: "text-right",
    },
    {
      id: "actions",
      header: "Ações",
      cell: (routeItem) => (
        <div className="flex justify-end gap-1">
          <TableActionButton
            label="Editar"
            icon={Pencil}
            onClick={() => {
              setEditingRoute(routeItem);
              setIsFormOpen(true);
            }}
          />
          <TableActionButton
            label="Excluir"
            icon={Trash2}
            variant="destructive"
            onClick={() => setRoutePendingDelete(routeItem)}
          />
        </div>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ];

  function closeForm() {
    setIsFormOpen(false);
    setEditingRoute(undefined);
  }

  async function saveRoute(request: CreateRouteRequest) {
    if (editingRoute) {
    } else {
      await addRoute(request);
      const response = await listRoutes(0, 5);
      setRoutes(response.content);
    }

    closeForm();
  }

  const [institutions, setInstitutions] = useState<InstitutionEntity[]>([]);
  const [boardPoints, setBoardPoints] = useState<BoardPointEntity[]>([]);
  const [bus, setBus] = useState<BusEntity[]>([]);

  useEffect(() => {
    async function fetchResources() {
      setInstitutions(await listInstitutions());
      setBoardPoints((await listBoardPoints(0, 100)).content);
      setBus(await listBus());
    }
    fetchResources();
  }, []);
  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6 ">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-950">
            Rotas escolares
          </p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Defina trajetos, horários de ida e volta para cada ponto, ônibus e
            instituições atendidas.
          </p>
        </div>

        <Button
          type="button"
          size="xs"
          className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_0_28px_-12px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
          onClick={() => {
            setEditingRoute(undefined);
            setIsFormOpen(true);
          }}
        >
          <Plus className="h-3 w-4" />
          Nova rota
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <RouteFilters
          shift={shiftFilter}
          status={statusFilter}
          onShiftChange={setShiftFilter}
          onStatusChange={setStatusFilter}
        />
        <p className="text-sm font-medium text-slate-500">
          {filteredRoutes.length} rota(s) encontrada(s)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filteredRoutes}
        getRowId={(routeItem) => routeItem.id}
        emptyMessage="Nenhuma rota encontrada para os filtros selecionados."
        pageSize={5}
      />

      {routePendingDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-md"
            aria-label="Fechar exclusão de rota"
            onClick={() => setRoutePendingDelete(undefined)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-[#E5EAF0]/80 bg-white p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#DC2626]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">Excluir rota</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Deseja excluir a rota {routePendingDelete.code}? Esta ação
                  remove o item da listagem local desta tela.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                onClick={() => setRoutePendingDelete(undefined)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="h-9 cursor-pointer rounded-xl bg-[#DC2626] px-4 text-xs font-semibold text-white shadow-[0_16px_36px_-20px_rgba(220,38,38,0.9)] hover:bg-red-700"
                onClick={() => {
                  setRoutes((currentRoutes) =>
                    currentRoutes.filter((currentRoute) => {
                      return currentRoute.id !== routePendingDelete.id;
                    }),
                  );
                  setRoutePendingDelete(undefined);
                }}
              >
                Excluir rota
              </Button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-md"
            aria-label="Fechar formulário de rota"
            onClick={closeForm}
          />
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-[#E5EAF0]/80 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
            <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] px-6 py-5 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.26),transparent_34%),radial-gradient(circle_at_84%_30%,rgba(255,255,255,0.16),transparent_32%)]" />
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                className="absolute right-4 top-4 h-8 w-8 cursor-pointer rounded-xl text-white/80 hover:bg-white/15 hover:text-white"
                aria-label="Fechar formulário de rota"
                onClick={closeForm}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="relative flex items-start gap-4 pr-10">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Route className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold">
                    {editingRoute ? "Editar rota" : "Nova rota"}
                  </p>
                  <p className="mt-1 text-sm text-white/75">
                    Configure trajeto, recorrência, horários, ônibus e pontos de
                    embarque da rota.
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-[calc(90vh-116px)] overflow-y-auto p-6 [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
              <RouteForm
                key={editingRoute?.id ?? "new-route"}
                initialRoute={editingRoute}
                institutions={institutions.map((i) => {
                  return { id: i.id as string, label: i.name };
                })}
                bus={bus.map((b) => {
                  return { id: b.id as string, label: b.plate };
                })}
                boardPoints={boardPoints.map((b) => {
                  return { id: b.id as string, label: b.name };
                })}
                onSubmit={saveRoute}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
