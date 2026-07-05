"use client";

import { AlertTriangle, Plus } from "lucide-react";
import { useState } from "react";
import InstitutionCard from "@/components/molecules/institutions/InstitutionCard";
import InstitutionDetailsModal from "@/components/molecules/institutions/InstitutionDetailsModal";
import { Button } from "@/components/ui/button";
import type { InstitutionEntity } from "@/types/entites/InstitutionEntity";

const initialInstitutions: InstitutionEntity[] = [
  {
    id: "institution-001",
    name: "E.M. João Paulo II",
    latitude: -19.9187,
    longitude: -43.9386,
    routeCount: 4,
    routes: [
      {
        id: "route-12",
        code: "R-12",
        name: "Centro -> E.M. João Paulo",
        shift: "Matutino",
      },
      {
        id: "route-15",
        code: "R-15",
        name: "Vila Norte -> João Paulo",
        shift: "Vespertino",
      },
      {
        id: "route-18",
        code: "R-18",
        name: "Distrito Rural -> João Paulo",
        shift: "Matutino",
      },
      {
        id: "route-22",
        code: "R-22",
        name: "Jardim Sul -> João Paulo",
        shift: "Noturno",
      },
    ],
  },
  {
    id: "institution-002",
    name: "E.E. Santos Dumont",
    latitude: -19.9234,
    longitude: -43.942,
    routeCount: 3,
    routes: [
      {
        id: "route-08",
        code: "R-08",
        name: "Vila Nova -> Santos Dumont",
        shift: "Matutino",
      },
      {
        id: "route-11",
        code: "R-11",
        name: "Bairro Alto -> Santos Dumont",
        shift: "Vespertino",
      },
      {
        id: "route-16",
        code: "R-16",
        name: "Centro -> Santos Dumont",
        shift: "Matutino",
      },
    ],
  },
  {
    id: "institution-003",
    name: "CMEI Girassol",
    latitude: -19.9301,
    longitude: -43.9588,
    routeCount: 2,
    routes: [
      {
        id: "route-04",
        code: "R-04",
        name: "Bairro Alto -> CMEI Girassol",
        shift: "Vespertino",
      },
      {
        id: "route-09",
        code: "R-09",
        name: "Centro -> CMEI Girassol",
        shift: "Matutino",
      },
    ],
  },
  {
    id: "institution-004",
    name: "IFMG Campus 2",
    latitude: -19.9402,
    longitude: -43.9601,
    routeCount: 5,
    routes: [
      {
        id: "route-20",
        code: "R-20",
        name: "Centro -> IFMG Campus 2",
        shift: "Matutino",
      },
      {
        id: "route-21",
        code: "R-21",
        name: "Setor Norte -> IFMG Campus 2",
        shift: "Vespertino",
      },
      {
        id: "route-24",
        code: "R-24",
        name: "Vila Nova -> IFMG Campus 2",
        shift: "Noturno",
      },
      {
        id: "route-27",
        code: "R-27",
        name: "Rural km 4 -> IFMG Campus 2",
        shift: "Matutino",
      },
      {
        id: "route-30",
        code: "R-30",
        name: "Jardim Sul -> IFMG Campus 2",
        shift: "Vespertino",
      },
    ],
  },
  {
    id: "institution-005",
    name: "E.M. Castro Alves",
    latitude: -19.9012,
    longitude: -43.9501,
    routeCount: 2,
    routes: [
      {
        id: "route-31",
        code: "R-31",
        name: "Setor Norte -> Castro Alves",
        shift: "Matutino",
      },
      {
        id: "route-34",
        code: "R-34",
        name: "Centro -> Castro Alves",
        shift: "Vespertino",
      },
    ],
  },
  {
    id: "institution-006",
    name: "E.M. Vereda Verde",
    latitude: -19.9652,
    longitude: -43.9824,
    routeCount: 1,
    routes: [
      {
        id: "route-40",
        code: "R-40",
        name: "Distrito Rural -> Vereda Verde",
        shift: "Matutino",
      },
    ],
  },
];

export default function Institutions() {
  const [institutions, setInstitutions] =
    useState<InstitutionEntity[]>(initialInstitutions);
  const [selectedInstitution, setSelectedInstitution] =
    useState<InstitutionEntity>();
  const [modalMode, setModalMode] = useState<"details" | "create">("details");
  const [institutionPendingDelete, setInstitutionPendingDelete] =
    useState<InstitutionEntity>();

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

  function saveInstitution(updatedInstitution: InstitutionEntity) {
    setInstitutions((currentInstitutions) => {
      const institutionExists = currentInstitutions.some(
        (institution) => institution.id === updatedInstitution.id,
      );

      if (!institutionExists) {
        return [updatedInstitution, ...currentInstitutions];
      }

      return currentInstitutions.map((institution) =>
        institution.id === updatedInstitution.id
          ? updatedInstitution
          : institution,
      );
    });
    setModalMode("details");
    setSelectedInstitution(updatedInstitution);
  }

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
        {institutions.length} instituição(ões) cadastrada(s)
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
                onClick={() => setInstitutionPendingDelete(undefined)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="h-9 cursor-pointer rounded-xl bg-[#DC2626] px-4 text-xs font-semibold text-white shadow-[0_16px_36px_-20px_rgba(220,38,38,0.9)] hover:bg-red-700"
                onClick={() => {
                  setInstitutions((currentInstitutions) =>
                    currentInstitutions.filter(
                      (institution) =>
                        institution.id !== institutionPendingDelete.id,
                    ),
                  );
                  setInstitutionPendingDelete(undefined);
                }}
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
