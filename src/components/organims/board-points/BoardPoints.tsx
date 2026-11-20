"use client";

import { AlertTriangle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import BoardPointCard from "@/components/molecules/board-points/BoardPointCard";
import BoardPointForm from "@/components/molecules/board-points/BoardPointForm";
import { Button } from "@/components/ui/button";
import {
  createBoardPoint,
  deleteBoardPoint,
  listBoardPoints,
  updateBoardPoint,
} from "@/service/BoardPointService";
import {
  listEntityPhotos,
  uploadEntityPhoto,
} from "@/service/EntityPhotoService";
import type { BoardPointEntity } from "@/types/entites/BoardPointEntity";
import type { CreateBoardPointRequest } from "@/types/request/BoardPointRequest";

const PAGE_SIZE = 6;

export default function BoardPoints() {
  const [boardPoints, setBoardPoints] = useState<BoardPointEntity[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalBoardPoints, setTotalBoardPoints] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [editingBoardPoint, setEditingBoardPoint] =
    useState<BoardPointEntity>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [boardPointPendingDelete, setBoardPointPendingDelete] =
    useState<BoardPointEntity>();
  const [boardPointPhotoUrls, setBoardPointPhotoUrls] = useState<
    Record<string, string>
  >({});

  function closeForm() {
    setIsFormOpen(false);
    setEditingBoardPoint(undefined);
  }

  const fetchBoardPoints = useCallback(
    async (page = currentPage) => {
      const response = await listBoardPoints(page, PAGE_SIZE);
      setBoardPoints(response.content);
      const photos = await Promise.all(
        response.content.map(async (boardPoint) => {
          const files = await listEntityPhotos("board-points", boardPoint.id);
          return [boardPoint.id, files[0]?.url] as const;
        }),
      );
      setBoardPointPhotoUrls((current) => ({
        ...current,
        ...Object.fromEntries(photos.filter(([, url]) => url)),
      }));
      setTotalBoardPoints(response.page.totalElements);
      setTotalPages(response.page.totalPages || 1);
    },
    [currentPage],
  );

  async function saveBoardPoint(
    request: CreateBoardPointRequest,
    photo?: File,
  ) {
    if (editingBoardPoint) {
      const savedBoardPoint = await updateBoardPoint(
        editingBoardPoint.id,
        request,
      );
      if (photo) {
        const uploadedPhoto = await uploadEntityPhoto(
          "board-points",
          savedBoardPoint.id,
          photo,
        );
        setBoardPointPhotoUrls((current) => ({
          ...current,
          [savedBoardPoint.id]: uploadedPhoto.url,
        }));
      }
      await fetchBoardPoints();
    } else {
      const createdBoardPoint = await createBoardPoint(request);
      if (photo) {
        const uploadedPhoto = await uploadEntityPhoto(
          "board-points",
          createdBoardPoint.id,
          photo,
        );
        setBoardPointPhotoUrls((current) => ({
          ...current,
          [createdBoardPoint.id]: uploadedPhoto.url,
        }));
      }
      setCurrentPage(0);
      await fetchBoardPoints(0);
    }

    closeForm();
  }

  async function deleteBoardPointFromService(boardPoint: BoardPointEntity) {
    await deleteBoardPoint(boardPoint.id);
    setBoardPointPendingDelete(undefined);

    if (boardPoints.length === 1 && currentPage > 0) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      await fetchBoardPoints(previousPage);
      return;
    }

    await fetchBoardPoints();
  }

  useEffect(() => {
    void fetchBoardPoints();
  }, [fetchBoardPoints]);

  const safeCurrentPage = Math.min(currentPage + 1, totalPages);

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

      <p className="text-sm font-medium text-slate-500">
        {totalBoardPoints} ponto(s) cadastrado(s)
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {boardPoints.map((boardPoint) => (
          <BoardPointCard
            key={boardPoint.id}
            boardPoint={boardPoint}
            photoUrl={boardPointPhotoUrls[boardPoint.id]}
            onViewDetails={(point) => {
              setEditingBoardPoint(point);
              setIsFormOpen(true);
            }}
            onDelete={setBoardPointPendingDelete}
          />
        ))}
      </div>

      {boardPoints.length === 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-muted-foreground shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]">
          Nenhum ponto de embarque cadastrado.
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E5EAF0] bg-white px-6 py-4 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          Página {safeCurrentPage} de {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="h-7 w-11 cursor-pointer rounded-xl border-[#E5EAF0] text-slate-600 hover:bg-[#EEF2F7] disabled:cursor-not-allowed"
            aria-label="Página anterior"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="h-7 w-11 cursor-pointer rounded-xl border-[#E5EAF0] text-slate-600 hover:bg-[#EEF2F7] disabled:cursor-not-allowed"
            aria-label="Próxima página"
            disabled={safeCurrentPage >= totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages - 1, page + 1))
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {boardPointPendingDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
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
                  ação remove o ponto no cadastro de locais.
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
                onClick={() =>
                  deleteBoardPointFromService(boardPointPendingDelete)
                }
              >
                Excluir ponto
              </Button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
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
              photoUrl={
                editingBoardPoint
                  ? boardPointPhotoUrls[editingBoardPoint.id]
                  : undefined
              }
              onSubmit={saveBoardPoint}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
