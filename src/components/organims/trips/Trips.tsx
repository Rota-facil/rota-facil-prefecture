"use client";

import { MapPinned } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MetricCard from "@/components/atom/MetricCard";
import DataTable, {
  type DataTableColumn,
} from "@/components/molecules/DataTable";
import TripFilters, {
  type TripStatusFilter,
} from "@/components/molecules/trips/TripFilters";
import TripProgressModal from "@/components/molecules/trips/TripProgressModal";
import { Button } from "@/components/ui/button";
import { getMetrics } from "@/service/MetricService";
import { listTrips } from "@/service/TripService";
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

  useEffect(() => {
    async function fetchTrips() {
      const response = await listTrips(currentPage - 1, PAGE_SIZE);
      setTrips(response.content);
      setTotalItems(response.page.totalElements);
      setTotalPages(response.page.totalPages || 1);
    }

    fetchTrips();
  }, [currentPage]);

  useEffect(() => {
    async function fetchMetrics() {
      setMetrics(await getMetrics());
    }

    fetchMetrics();
  }, []);

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
      header: "Rota",
      cell: (trip) => (
        <span className="text-sm font-semibold text-slate-800">
          {trip.route.name}
        </span>
      ),
      className: "min-w-72",
    },
    {
      id: "driver",
      header: "Motorista",
      cell: (trip) => trip.bus.driver?.name ?? "Sem motorista",
    },
    {
      id: "bus",
      header: "Ônibus",
      cell: (trip) => (
        <span className="font-mono text-xs">{trip.bus.plate}</span>
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
      ),
      className: "text-right",
      headerClassName: "text-right",
    },
  ];

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div>
        <p className="text-3xl font-bold tracking-tight text-slate-950">
          Viagens
        </p>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Acompanhe viagens, check-ins, cancelamentos e progresso em tempo real.
        </p>
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

      {selectedTrip && (
        <TripProgressModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(undefined)}
        />
      )}
    </div>
  );
}
