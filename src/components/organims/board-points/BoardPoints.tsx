"use client";

import { AlertTriangle, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import TableActionButton from "@/components/atom/TableActionButton";
import BoardPointForm from "@/components/molecules/board-points/BoardPointForm";
import DataTable, {
  type DataTableColumn,
} from "@/components/molecules/DataTable";
import { Button } from "@/components/ui/button";
import type { BoardPointEntity } from "@/types/entites/BoardPointEntity";
import type { CreateBoardPointRequest } from "@/types/request/BoardPointRequest";

const initialBoardPoints: BoardPointEntity[] = [
  {
    id: "board-point-001",
    name: "Praça Central",
    latitude: -19.9187,
    longitude: -43.9386,
    createdAtLabel: "Criado há 4 dias",
    routeCount: 4,
  },
  {
    id: "board-point-002",
    name: "Av. das Palmeiras, 240",
    latitude: -19.9012,
    longitude: -43.9501,
    createdAtLabel: "Criado há 4 dias",
    routeCount: 2,
  },
  {
    id: "board-point-003",
    name: "Esquina Bahia / Goiás",
    latitude: -19.9234,
    longitude: -43.942,
    createdAtLabel: "Criado há 3 dias",
    routeCount: 3,
  },
  {
    id: "board-point-004",
    name: "Mercado do Bairro",
    latitude: -19.9301,
    longitude: -43.9588,
    createdAtLabel: "Criado há 2 dias",
    routeCount: 2,
  },
  {
    id: "board-point-005",
    name: "Igreja São José",
    latitude: -19.9402,
    longitude: -43.9601,
    createdAtLabel: "Criado ontem",
    routeCount: 1,
  },
];

function formatCoordinate(value: number) {
  return value.toFixed(4);
}

function buildBoardPointFromRequest(
  request: CreateBoardPointRequest,
  routeCount: number,
  id?: string,
): BoardPointEntity {
  return {
    id: id ?? crypto.randomUUID(),
    name: request.name,
    latitude: request.latitude,
    longitude: request.longitude,
    createdAtLabel: id ? "Atualizado agora" : "Criado agora",
    routeCount,
  };
}

export default function BoardPoints() {
  const [boardPoints, setBoardPoints] =
    useState<BoardPointEntity[]>(initialBoardPoints);
  const [editingBoardPoint, setEditingBoardPoint] =
    useState<BoardPointEntity>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [boardPointPendingDelete, setBoardPointPendingDelete] =
    useState<BoardPointEntity>();

  const columns = useMemo<DataTableColumn<BoardPointEntity>[]>(
    () => [
      {
        id: "code",
        header: "Código",
        cell: (boardPoint) => (
          <span className="font-mono text-xs font-semibold text-[#1E3A8A]">
            P-
            {String(
              boardPoints.findIndex((item) => item.id === boardPoint.id) + 1,
            ).padStart(3, "0")}
          </span>
        ),
        className: "w-28",
      },
      {
        id: "name",
        header: "Ponto de embarque",
        cell: (boardPoint) => (
          <div className="flex min-w-0 items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#1E3A8A]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {boardPoint.name}
              </p>
              <p className="text-xs text-slate-400">
                {boardPoint.createdAtLabel}
              </p>
            </div>
          </div>
        ),
        className: "min-w-72",
      },
      {
        id: "latitude",
        header: "Latitude",
        cell: (boardPoint) => (
          <span className="font-mono text-xs">
            {formatCoordinate(boardPoint.latitude)}
          </span>
        ),
      },
      {
        id: "longitude",
        header: "Longitude",
        cell: (boardPoint) => (
          <span className="font-mono text-xs">
            {formatCoordinate(boardPoint.longitude)}
          </span>
        ),
      },
      {
        id: "routes",
        header: "Rotas",
        cell: (boardPoint) => boardPoint.routeCount,
        className: "text-center font-medium",
        headerClassName: "text-center",
      },
      {
        id: "actions",
        header: "Ações",
        cell: (boardPoint) => (
          <div className="flex justify-end gap-1">
            <TableActionButton
              label="Editar"
              icon={Pencil}
              onClick={() => {
                setEditingBoardPoint(boardPoint);
                setIsFormOpen(true);
              }}
            />
            <TableActionButton
              label="Excluir"
              icon={Trash2}
              variant="destructive"
              onClick={() => setBoardPointPendingDelete(boardPoint)}
            />
          </div>
        ),
        className: "text-right",
        headerClassName: "text-right",
      },
    ],
    [boardPoints],
  );

  function closeForm() {
    setIsFormOpen(false);
    setEditingBoardPoint(undefined);
  }

  function saveBoardPoint(request: CreateBoardPointRequest) {
    if (editingBoardPoint) {
      setBoardPoints((currentBoardPoints) =>
        currentBoardPoints.map((boardPoint) =>
          boardPoint.id === editingBoardPoint.id
            ? buildBoardPointFromRequest(
                request,
                boardPoint.routeCount,
                boardPoint.id,
              )
            : boardPoint,
        ),
      );
    } else {
      setBoardPoints((currentBoardPoints) => [
        buildBoardPointFromRequest(request, 0),
        ...currentBoardPoints,
      ]);
    }

    closeForm();
  }

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-950">
            Pontos de embarque
          </p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Cadastre e mantenha os pontos usados nas rotas escolares com nome,
            latitude e longitude.
          </p>
        </div>

        <Button
          type="button"
          size="xs"
          className="h-10 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 text-sm font-semibold text-white shadow-[0_0_24px_-14px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
          onClick={() => {
            setEditingBoardPoint(undefined);
            setIsFormOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Novo ponto
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {boardPoints.length} ponto(s) cadastrado(s)
        </p>
      </div>

      <DataTable
        columns={columns}
        data={boardPoints}
        getRowId={(boardPoint) => boardPoint.id}
        emptyMessage="Nenhum ponto de embarque cadastrado."
        pageSize={5}
      />

      {boardPointPendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-[#E5EAF0]/80 bg-white p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#DC2626]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">
                  Excluir ponto
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Deseja excluir o ponto {boardPointPendingDelete.name}? Esta
                  ação remove o item da listagem local desta tela.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                onClick={() => setBoardPointPendingDelete(undefined)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="h-9 cursor-pointer rounded-xl bg-[#DC2626] px-4 text-xs font-semibold text-white shadow-[0_16px_36px_-20px_rgba(220,38,38,0.9)] hover:bg-red-700"
                onClick={() => {
                  setBoardPoints((currentBoardPoints) =>
                    currentBoardPoints.filter(
                      (boardPoint) =>
                        boardPoint.id !== boardPointPendingDelete.id,
                    ),
                  );
                  setBoardPointPendingDelete(undefined);
                }}
              >
                Excluir ponto
              </Button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#E5EAF0]/80 bg-white p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
            <div className="mb-5">
              <p className="text-lg font-bold text-slate-950">
                {editingBoardPoint ? "Editar ponto" : "Novo ponto"}
              </p>
              <p className="text-sm text-slate-500">
                Informe apenas nome, latitude e longitude do ponto de embarque.
              </p>
            </div>

            <BoardPointForm
              key={editingBoardPoint?.id ?? "new-board-point"}
              initialBoardPoint={editingBoardPoint}
              onSubmit={saveBoardPoint}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
