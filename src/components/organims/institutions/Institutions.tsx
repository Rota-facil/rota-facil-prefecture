"use client";

import { AlertTriangle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import InstitutionCard from "@/components/molecules/institutions/InstitutionCard";
import InstitutionDetailsModal from "@/components/molecules/institutions/InstitutionDetailsModal";
import { Button } from "@/components/ui/button";
import {
  createInstitution,
  deleteInstitution,
  listInstitutionsPage,
  updateInstitution,
} from "@/service/InstitutionService";
import type { InstitutionEntity } from "@/types/entites/InstitutionEntity";

const PAGE_SIZE = 6;

export default function Institutions() {
  const [institutions, setInstitutions] = useState<InstitutionEntity[]>([]);
  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitutionEntity>();
  const [modalMode, setModalMode] = useState<"details" | "create">("details");
  const [institutionPendingDelete, setInstitutionPendingDelete] =
    useState<InstitutionEntity>();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalInstitutions, setTotalInstitutions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInstitutions = useCallback(
    async (page = currentPage) => {
      const response = await listInstitutionsPage(page, PAGE_SIZE);
      setInstitutions(response.content);
      setTotalInstitutions(response.page.totalElements);
      setTotalPages(response.page.totalPages || 1);
    },
    [currentPage],
  );

  function openDetails(institution: InstitutionEntity) {
    setModalMode("details");
    setSelectedInstitution(institution);
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedInstitution({
      id: crypto.randomUUID(),
      name: "",
      latitude: 0,
      longitude: 0,
      routeCount: 0,
      routes: [],
    });
  }

  async function saveInstitution(updatedInstitution: InstitutionEntity) {
    const request = {
      name: updatedInstitution.name,
      latitude: updatedInstitution.latitude,
      longitude: updatedInstitution.longitude,
    };

    if (modalMode === "create") {
      const createdInstitution = await createInstitution(request);
      setCurrentPage(0);
      await fetchInstitutions(0);
      setModalMode("details");
      setSelectedInstitution(createdInstitution);
      return;
    }

    const savedInstitution = await updateInstitution(
      updatedInstitution.id,
      request,
    );
    await fetchInstitutions();
    setModalMode("details");
    setSelectedInstitution(savedInstitution);
  }

  async function deleteInstitutionFromService(institution: InstitutionEntity) {
    await deleteInstitution(institution.id);
    setInstitutionPendingDelete(undefined);

    if (selectedInstitution?.id === institution.id) {
      setSelectedInstitution(undefined);
    }

    if (institutions.length === 1 && currentPage > 0) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      await fetchInstitutions(previousPage);
      return;
    }

    await fetchInstitutions();
  }

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  const safeCurrentPage = Math.min(currentPage + 1, totalPages);

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-950">
            Instituições
          </p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Acompanhe as instituições atendidas e as rotas associadas a cada
            uma.
          </p>
        </div>

        <Button
          type="button"
          size="xs"
          className="h-10 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 text-sm font-semibold text-white shadow-[0_0_24px_-14px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
          onClick={openCreateModal}
        >
          <Plus className="h-3.5 w-3.5" />
          Nova instituição
        </Button>
      </div>

      <p className="text-sm font-medium text-slate-500">
        {totalInstitutions} instituição(ões) cadastrada(s)
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {institutions.map((institution) => (
          <InstitutionCard
            key={institution.id}
            institution={institution}
            onViewDetails={openDetails}
            onDelete={setInstitutionPendingDelete}
          />
        ))}
      </div>

      {institutions.length === 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-10 text-center text-sm text-muted-foreground shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]">
          Nenhuma instituição cadastrada.
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

      {selectedInstitution && (
        <InstitutionDetailsModal
          institution={selectedInstitution}
          mode={modalMode}
          onClose={() => setSelectedInstitution(undefined)}
          onSave={saveInstitution}
        />
      )}

      {institutionPendingDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-[#E5EAF0]/80 bg-white p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#DC2626]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">
                  Excluir instituição
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Deseja excluir {institutionPendingDelete.name}? Esta ação
                  remove a instituição no cadastro de locais.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                onClick={() => setInstitutionPendingDelete(undefined)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="h-9 cursor-pointer rounded-xl bg-[#DC2626] px-4 text-xs font-semibold text-white shadow-[0_16px_36px_-20px_rgba(220,38,38,0.9)] hover:bg-red-700"
                onClick={() =>
                  deleteInstitutionFromService(institutionPendingDelete)
                }
              >
                Excluir instituição
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
