"use client";

import { AlertTriangle, MapPinned, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import MetricCard from "@/components/atom/MetricCard";
import TableActionButton from "@/components/atom/TableActionButton";
import DataTable, {
  type DataTableColumn,
} from "@/components/molecules/DataTable";
import CreateTripModal from "@/components/molecules/trips/CreateTripModal";
import TripFilters, {
  type TripStatusFilter,
} from "@/components/molecules/trips/TripFilters";
import TripProgressModal from "@/components/molecules/trips/TripProgressModal";
import { Button } from "@/components/ui/button";
import { getMetrics } from "@/service/MetricService";
import { listRoutesSimple } from "@/service/RouteService";
import {
  type CreateTripRequest,
  createTrip,
  deleteTrip,
  listTrips,
} from "@/service/TripService";
import type { RouteEntity } from "@/types/entites/RouteEntity";
import type { TripEntity } from "@/types/entites/TripEntity";
import { Progress } from "@/types/enums/Progress";
import type { MetricResponse } from "@/types/response/MetricResponse";

const PAGE_SIZE = 5;

function resolveTripFilterStatus(trip: TripEntity): TripStatusFilter {
  if (trip.actualStatus === Progress.CANCELLED) {
    return "CANCELLED";
  }

  if (trip.actualStatus === Progress.NOT_STARTED) {
    return "WAITING";
  }

  if (trip.actualStatus === Progress.RETURN_FINISHED) {
    return "FINISHED";
  }

  return "IN_ROUTE";
}

function getTripStatusBadge(trip: TripEntity) {
  const status = resolveTripFilterStatus(trip) as Exclude<
    TripStatusFilter,
    "ALL"
  >;

  const statusConfig = {
    IN_ROUTE: "bg-blue-50 text-[#1E3A8A] ring-blue-200",
    FINISHED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    CANCELLED: "bg-red-50 text-[#DC2626] ring-red-200",
    WAITING: "bg-amber-50 text-amber-700 ring-amber-200",
  } satisfies Record<Exclude<TripStatusFilter, "ALL">, string>;

  const labels = {
    IN_ROUTE: "Em rota",
    FINISHED: "Finalizada",
    CANCELLED: "Cancelada",
    WAITING: "Aguardando",
  } satisfies Record<Exclude<TripStatusFilter, "ALL">, string>;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusConfig[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {labels[status]}
    </span>
  );
}

export default function Trips() {
  const [statusFilter, setStatusFilter] = useState<TripStatusFilter>("ALL");
  const [selectedTrip, setSelectedTrip] = useState<TripEntity>();
  const [trips, setTrips] = useState<TripEntity[]>([]);
  const [metrics, setMetrics] = useState<MetricResponse>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [routes, setRoutes] = useState<RouteEntity[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tripPendingDelete, setTripPendingDelete] = useState<TripEntity>();

  const fetchTrips = useCallback(async () => {
    const response = await listTrips(currentPage - 1, PAGE_SIZE);
    setTrips(response.content);
    setTotalItems(response.page.totalElements);
    setTotalPages(response.page.totalPages || 1);
  }, [currentPage]);

  useEffect(() => {
    void fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    async function fetchResources() {
      const [metricsFound, routesFound] = await Promise.all([
        getMetrics(),
        listRoutesSimple(),
      ]);
      setMetrics(metricsFound);
      setRoutes(routesFound);
    }

    void fetchResources();
  }, []);

  async function handleCreateTrip(
    request: CreateTripRequest,
  ): Promise<boolean> {
    try {
      await createTrip(request);
    } catch {
      return false;
    }

    if (currentPage === 1) {
      try {
        await fetchTrips();
      } catch {
        toast.error("Viagem criada, mas não foi possível atualizar a lista.");
      }
    } else {
      setCurrentPage(1);
    }

    try {
      setMetrics(await getMetrics());
    } catch {
      // A falha das métricas não deve impedir o fechamento do modal.
    }

    toast.success("Viagem criada com sucesso.");
    return true;
  }

  async function confirmDeleteTrip() {
    if (!tripPendingDelete) {
      return;
    }

    try {
      await deleteTrip(tripPendingDelete.id);
      setTripPendingDelete(undefined);
      if (currentPage > 1 && trips.length === 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await fetchTrips();
      }
      setMetrics(await getMetrics());
      toast.success("Viagem excluída com sucesso.");
    } catch {
      toast.error("Não foi possível excluir a viagem.");
    }
  }

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      return (
        statusFilter === "ALL" || resolveTripFilterStatus(trip) === statusFilter
      );
    });
  }, [trips, statusFilter]);

  const columns: DataTableColumn<TripEntity>[] = [
    {
      id: "route",
      header: "Viagem / rota",
      cell: (trip) => (
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {trip.name || trip.route.name}
          </p>
          {trip.name !== trip.route.name && (
            <p className="mt-0.5 text-xs text-slate-500">{trip.route.name}</p>
          )}
        </div>
      ),
      className: "min-w-72",
    },
    {
      id: "driver",
      header: "Motorista",
      cell: (trip) => trip.vehicle.driver?.email ?? "Sem motorista",
    },
    {
      id: "vehicle",
      header: "Veículo",
      cell: (trip) => (
        <span className="font-mono text-xs">{trip.vehicle.plate}</span>
      ),
    },
    {
      id: "students",
      header: "Alunos",
      cell: (trip) => `${trip.students}/${trip.expectedStudents}`,
      className: "text-center font-medium",
      headerClassName: "text-center",
    },
    {
      id: "start",
      header: "Data",
      cell: (trip) => trip.startedAtLabel,
    },
    {
      id: "status",
      header: "Status",
      cell: (trip) => getTripStatusBadge(trip),
    },
    {
      id: "actions",
      header: "",
      cell: (trip) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-8 cursor-pointer rounded-xl border-[#E5EAF0] px-3 text-xs font-semibold hover:bg-[#EEF2F7]"
            onClick={() => setSelectedTrip(trip)}
          >
            <MapPinned className="h-3.5 w-3.5" />
            Acompanhar no mapa
          </Button>
          <TableActionButton
            label="Excluir viagem"
            icon={Trash2}
            variant="destructive"
            onClick={() => setTripPendingDelete(trip)}
          />
        </div>
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ];

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-950">
            Viagens
          </p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Acompanhe viagens, check-ins, cancelamentos e progresso em tempo
            real.
          </p>
        </div>

        <Button
          type="button"
          size="xs"
          className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_0_28px_-12px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nova viagem
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          variants="tripsInRoute"
          value={metrics?.tripsInRoute ?? 0}
          size="xs"
        />
        <MetricCard
          variants="tripsFinishedToday"
          value={metrics?.tripsFinishedToday ?? 0}
          size="xs"
        />
        <MetricCard
          variants="tripsCancelledToday"
          value={metrics?.tripsCancelledToday ?? 0}
          size="xs"
        />
        <MetricCard
          variants="tripsWaiting"
          value={metrics?.tripsWaiting ?? 0}
          size="xs"
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <TripFilters status={statusFilter} onStatusChange={setStatusFilter} />
        <p className="text-sm font-medium text-slate-500">
          {filteredTrips.length} viagem(ns) encontrada(s)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filteredTrips}
        getRowId={(trip) => trip.id}
        emptyMessage="Nenhuma viagem encontrada para o status selecionado."
        pageSize={PAGE_SIZE}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {tripPendingDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-md"
            aria-label="Fechar exclusão de viagem"
            onClick={() => setTripPendingDelete(undefined)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-[#E5EAF0]/80 bg-white p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="absolute right-4 top-4 h-8 w-8 cursor-pointer rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Fechar confirmação"
              onClick={() => setTripPendingDelete(undefined)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-4 pr-8">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#DC2626]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">
                  Excluir viagem
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Deseja excluir a viagem{" "}
                  {tripPendingDelete.name || tripPendingDelete.code}? Essa ação
                  não poderá ser desfeita.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                onClick={() => setTripPendingDelete(undefined)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="h-9 cursor-pointer rounded-xl bg-[#DC2626] px-4 text-xs font-semibold text-white shadow-[0_16px_36px_-20px_rgba(220,38,38,0.9)] hover:bg-red-700"
                onClick={confirmDeleteTrip}
              >
                Excluir viagem
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedTrip && (
        <TripProgressModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(undefined)}
        />
      )}

      {isCreateModalOpen && (
        <CreateTripModal
          routes={routes}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTrip}
        />
      )}
    </div>
  );
}
