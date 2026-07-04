"use client";

import { useMemo, useState } from "react";
import MetricCard from "@/components/atom/MetricCard";
import DataTable, {
  type DataTableColumn,
} from "@/components/molecules/DataTable";
import TripFilters, {
  type TripStatusFilter,
} from "@/components/molecules/trips/TripFilters";
import TripProgressModal from "@/components/molecules/trips/TripProgressModal";
import { Button } from "@/components/ui/button";
import type { TripEntity } from "@/types/entites/TripEntity";
import { Progress } from "@/types/enums/Progress";

const prefecture = {
  id: "prefecture-001",
  name: "Prefeitura Municipal",
  city: "Belo Horizonte",
  state: "MG",
};

const routes = {
  route12: {
    id: "route-12",
    code: "R-12",
    name: "R-12 Centro -> E.M. João Paulo",
    shift: "Matutino",
    going: "06:30",
    return_: "12:00",
    goingFinish: "07:20",
    returnFinish: "12:50",
    boardPoints: [
      {
        id: "bp-01",
        name: "Praça Central",
        latitude: -19.9187,
        longitude: -43.9386,
      },
      {
        id: "bp-02",
        name: "Av. das Palmeiras, 240",
        latitude: -19.9012,
        longitude: -43.9501,
      },
    ],
    institutions: [
      {
        id: "ins-01",
        name: "E.M. João Paulo II",
        latitude: -19.9214,
        longitude: -43.9351,
      },
    ],
  },
  route08: {
    id: "route-08",
    code: "R-08",
    name: "R-08 Vila Nova -> Santos Dumont",
    shift: "Matutino",
    going: "06:15",
    return_: "11:50",
    goingFinish: "07:05",
    returnFinish: "12:35",
    boardPoints: [
      {
        id: "bp-03",
        name: "Esquina Bahia / Goiás",
        latitude: -19.9234,
        longitude: -43.942,
      },
    ],
    institutions: [
      {
        id: "ins-02",
        name: "E.E. Santos Dumont",
        latitude: -19.9271,
        longitude: -43.9452,
      },
    ],
  },
  route04: {
    id: "route-04",
    code: "R-04",
    name: "R-04 Bairro Alto -> Girassol",
    shift: "Vespertino",
    going: "13:00",
    return_: "17:00",
    goingFinish: "13:40",
    returnFinish: "17:45",
    boardPoints: [
      {
        id: "bp-04",
        name: "Mercado do Bairro",
        latitude: -19.9301,
        longitude: -43.9588,
      },
    ],
    institutions: [
      {
        id: "ins-03",
        name: "CMEI Girassol",
        latitude: -19.9342,
        longitude: -43.956,
      },
    ],
  },
  route21: {
    id: "route-21",
    code: "R-21",
    name: "R-21 Jardim Sul -> IFMG",
    shift: "Vespertino",
    going: "13:30",
    return_: "18:00",
    goingFinish: "14:20",
    returnFinish: "18:40",
    boardPoints: [
      {
        id: "bp-05",
        name: "Igreja São José",
        latitude: -19.9402,
        longitude: -43.9601,
      },
    ],
    institutions: [
      {
        id: "ins-04",
        name: "IFMG Campus 2",
        latitude: -19.9449,
        longitude: -43.964,
      },
    ],
  },
};

const statusHistory = {
  trip2031: [
    {
      id: "status-2031-01",
      progress: Progress.NOT_STARTED,
      delay: "PUNCTUAL",
      description: "Viagem aguardando início no pátio",
      createdAt: new Date("2026-07-04T06:20:00"),
    },
    {
      id: "status-2031-02",
      progress: Progress.STARTED,
      delay: "PUNCTUAL",
      description: "Ida iniciada no horário previsto",
      createdAt: new Date("2026-07-04T06:30:00"),
    },
    {
      id: "status-2031-03",
      progress: Progress.BOARD_POINT_ARRIVAL,
      delay: "PUNCTUAL",
      description: "Passou pelo ponto Praça Central",
      createdAt: new Date("2026-07-04T06:42:00"),
    },
  ],
  trip2030: [
    {
      id: "status-2030-01",
      progress: Progress.STARTED,
      delay: "PUNCTUAL",
      description: "Ida iniciada no horário previsto",
      createdAt: new Date("2026-07-04T06:15:00"),
    },
    {
      id: "status-2030-02",
      progress: Progress.INSTITUTION_ARRIVAL,
      delay: "PUNCTUAL",
      description: "Passou pela instituição E.E. Santos Dumont",
      createdAt: new Date("2026-07-04T07:02:00"),
    },
    {
      id: "status-2030-03",
      progress: Progress.RETURN_FINISHED,
      delay: "PUNCTUAL",
      description: "Retorno finalizado",
      createdAt: new Date("2026-07-04T12:35:00"),
    },
  ],
  trip2029: [
    {
      id: "status-2029-01",
      progress: Progress.CANCELLED,
      delay: "PUNCTUAL",
      description: "Viagem cancelada",
      createdAt: new Date("2026-07-04T05:50:00"),
    },
  ],
  trip2028: [
    {
      id: "status-2028-01",
      progress: Progress.STARTED,
      delay: "LATE",
      description: "Ida iniciada com atraso",
      createdAt: new Date("2026-07-04T06:26:00"),
    },
    {
      id: "status-2028-02",
      progress: Progress.INSTITUTION_ARRIVAL,
      delay: "LATE",
      description: "Passou pela instituição E.M. João Paulo II",
      createdAt: new Date("2026-07-04T07:18:00"),
    },
  ],
  trip2027: [
    {
      id: "status-2027-01",
      progress: Progress.NOT_STARTED,
      delay: "PUNCTUAL",
      description: "Viagem aguardando início",
      createdAt: new Date("2026-07-04T13:20:00"),
    },
  ],
};

const initialTrips: TripEntity[] = [
  {
    id: "trip-2031",
    code: "V-2031",
    prefectureId: prefecture.id,
    name: "Viagem V-2031",
    students: 28,
    expectedStudents: 32,
    latitude: -19.9202,
    longitude: -43.9394,
    startedAtLabel: "Hoje, 06:30",
    createdAt: new Date("2026-07-04T06:30:00"),
    actualStatus: Progress.STARTED,
    bus: {
      id: 1,
      prefectureId: 1,
      capacity: 32,
      plate: "ABC-1D45",
      createdAt: new Date("2025-02-01"),
      driver: {
        id: "driver-01",
        name: "Carlos Mendes",
        email: "carlos.mendes@rotafacil.gov.br",
        cpf: "000.000.000-00",
        prefecture,
      },
    },
    route: routes.route12,
    tripStatus: statusHistory.trip2031,
  },
  {
    id: "trip-2030",
    code: "V-2030",
    prefectureId: prefecture.id,
    name: "Viagem V-2030",
    students: 18,
    expectedStudents: 18,
    latitude: -19.9271,
    longitude: -43.9452,
    startedAtLabel: "Hoje, 06:15",
    createdAt: new Date("2026-07-04T06:15:00"),
    actualStatus: Progress.RETURN_FINISHED,
    bus: {
      id: 2,
      prefectureId: 1,
      capacity: 24,
      plate: "QRT-2H88",
      createdAt: new Date("2025-03-10"),
      driver: {
        id: "driver-02",
        name: "Ana Lima",
        email: "ana.lima@rotafacil.gov.br",
        cpf: "000.000.000-00",
        prefecture,
      },
    },
    route: routes.route08,
    tripStatus: statusHistory.trip2030,
  },
  {
    id: "trip-2029",
    code: "V-2029",
    prefectureId: prefecture.id,
    name: "Viagem V-2029",
    reasonOfCancellation: "Motorista indisponível",
    students: 0,
    expectedStudents: 0,
    latitude: -19.9301,
    longitude: -43.9588,
    startedAtLabel: "Hoje, 06:00",
    createdAt: new Date("2026-07-04T06:00:00"),
    actualStatus: Progress.CANCELLED,
    bus: {
      id: 3,
      prefectureId: 1,
      capacity: 28,
      plate: "JKL-7M22",
      createdAt: new Date("2025-04-08"),
      driver: {
        id: "driver-03",
        name: "Marina Costa",
        email: "marina.costa@rotafacil.gov.br",
        cpf: "000.000.000-00",
        prefecture,
      },
    },
    route: routes.route04,
    tripStatus: statusHistory.trip2029,
  },
  {
    id: "trip-2028",
    code: "V-2028",
    prefectureId: prefecture.id,
    name: "Viagem V-2028",
    students: 24,
    expectedStudents: 27,
    latitude: -19.9058,
    longitude: -43.9515,
    startedAtLabel: "Hoje, 06:20",
    createdAt: new Date("2026-07-04T06:20:00"),
    actualStatus: Progress.INSTITUTION_ARRIVAL,
    bus: {
      id: 4,
      prefectureId: 1,
      capacity: 30,
      plate: "XYZ-9P12",
      createdAt: new Date("2025-05-12"),
      driver: {
        id: "driver-04",
        name: "Pedro Rocha",
        email: "pedro.rocha@rotafacil.gov.br",
        cpf: "000.000.000-00",
        prefecture,
      },
    },
    route: routes.route12,
    tripStatus: statusHistory.trip2028,
  },
  {
    id: "trip-2027",
    code: "V-2027",
    prefectureId: prefecture.id,
    name: "Viagem V-2027",
    students: 0,
    expectedStudents: 0,
    latitude: -19.9402,
    longitude: -43.9601,
    startedAtLabel: "Hoje, 13:30",
    createdAt: new Date("2026-07-04T13:30:00"),
    actualStatus: Progress.NOT_STARTED,
    bus: {
      id: 5,
      prefectureId: 1,
      capacity: 36,
      plate: "DEF-5K10",
      createdAt: new Date("2025-06-01"),
      driver: {
        id: "driver-05",
        name: "Roberto Silva",
        email: "roberto.silva@rotafacil.gov.br",
        cpf: "000.000.000-00",
        prefecture,
      },
    },
    route: routes.route21,
    tripStatus: statusHistory.trip2027,
  },
];

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

  const filteredTrips = useMemo(() => {
    return initialTrips.filter((trip) => {
      return (
        statusFilter === "ALL" || resolveTripFilterStatus(trip) === statusFilter
      );
    });
  }, [statusFilter]);

  const metrics = useMemo(() => {
    return {
      inRoute: initialTrips.filter(
        (trip) => resolveTripFilterStatus(trip) === "IN_ROUTE",
      ).length,
      finished: initialTrips.filter(
        (trip) => resolveTripFilterStatus(trip) === "FINISHED",
      ).length,
      cancelled: initialTrips.filter(
        (trip) => resolveTripFilterStatus(trip) === "CANCELLED",
      ).length,
      waiting: initialTrips.filter(
        (trip) => resolveTripFilterStatus(trip) === "WAITING",
      ).length,
    };
  }, []);

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
      cell: (trip) => trip.bus.driver.name,
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
      header: "Início",
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
          Ver progresso
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
        <MetricCard variants="tripsInRoute" value={metrics.inRoute} size="xs" />
        <MetricCard
          variants="tripsFinishedToday"
          value={metrics.finished}
          size="xs"
        />
        <MetricCard
          variants="tripsCancelledToday"
          value={metrics.cancelled}
          size="xs"
        />
        <MetricCard variants="tripsWaiting" value={metrics.waiting} size="xs" />
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
        pageSize={5}
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
