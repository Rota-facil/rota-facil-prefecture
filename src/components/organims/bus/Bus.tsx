"use client";

import { AlertTriangle, Plus } from "lucide-react";
import { useState } from "react";
import BusCard from "@/components/molecules/bus/BusCard";
import BusDetailsModal from "@/components/molecules/bus/BusDetailsModal";
import { Button } from "@/components/ui/button";
import type { BusEntity } from "@/types/entites/BusEntity";
import type { PrefectureEntity } from "@/types/entites/PrefectureEntity";
import type { UserEntity } from "@/types/entites/UserEntity";

const prefecture: PrefectureEntity = {
  id: "prefecture-001",
  name: "Prefeitura Municipal",
};

function createDriver(id: string, name: string, email: string): UserEntity {
  return {
    id,
    name,
    email,
    cpf: "",
    prefecture,
  };
}

const availableDrivers = [
  createDriver("driver-001", "Roberto Silva", "roberto@rotafacil.com"),
  createDriver("driver-002", "Mariana Costa", "mariana@rotafacil.com"),
  createDriver("driver-003", "Carlos Nunes", "carlos@rotafacil.com"),
  createDriver("driver-004", "Ana Ferreira", "ana@rotafacil.com"),
];

const initialBuses: BusEntity[] = [
  {
    id: "bus-001",
    prefectureId: prefecture.id,
    driver: availableDrivers[0],
    capacity: 44,
    plate: "DEF-5K10",
    status: "operating",
    createdAt: new Date("2026-01-08T08:00:00"),
  },
  {
    id: "bus-002",
    prefectureId: prefecture.id,
    driver: availableDrivers[1],
    capacity: 36,
    plate: "JKL-7M22",
    status: "outOfOperation",
    createdAt: new Date("2026-01-12T08:00:00"),
  },
  {
    id: "bus-003",
    prefectureId: prefecture.id,
    driver: availableDrivers[2],
    capacity: 50,
    plate: "GHI-3N09",
    status: "operating",
    createdAt: new Date("2026-01-20T08:00:00"),
  },
  {
    id: "bus-004",
    prefectureId: prefecture.id,
    driver: availableDrivers[3],
    capacity: 42,
    plate: "ABC-1D23",
    status: "outOfOperation",
    createdAt: new Date("2026-02-03T08:00:00"),
  },
];

function createEmptyBus(): BusEntity {
  return {
    id: crypto.randomUUID(),
    prefectureId: prefecture.id,
    driver: availableDrivers[0],
    capacity: 1,
    plate: "",
    status: "operating",
    createdAt: new Date(),
  };
}

export default function Bus() {
  const [buses, setBuses] = useState<BusEntity[]>(initialBuses);
  const [selectedBus, setSelectedBus] = useState<BusEntity>();
  const [modalMode, setModalMode] = useState<"details" | "create" | "edit">(
    "details",
  );
  const [busPendingDelete, setBusPendingDelete] = useState<BusEntity>();

  function openDetails(bus: BusEntity) {
    setModalMode("details");
    setSelectedBus(bus);
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedBus(createEmptyBus());
  }

  function saveBus(updatedBus: BusEntity) {
    setBuses((currentBuses) => {
      const busExists = currentBuses.some((bus) => bus.id === updatedBus.id);

      if (!busExists) {
        return [updatedBus, ...currentBuses];
      }

      return currentBuses.map((bus) =>
        bus.id === updatedBus.id ? updatedBus : bus,
      );
    });
    setModalMode("details");
    setSelectedBus(updatedBus);
  }

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-950">
            Ônibus
          </p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Gerencie a frota, motoristas vinculados, capacidade e status
            operacional dos veículos.
          </p>
        </div>

        <Button
          type="button"
          size="xs"
          className="h-10 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 text-sm font-semibold text-white shadow-[0_0_24px_-14px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
          onClick={openCreateModal}
        >
          <Plus className="h-3.5 w-3.5" />
          Novo ônibus
        </Button>
      </div>

      <p className="text-sm font-medium text-slate-500">
        {buses.length} ônibus cadastrado(s)
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {buses.map((bus) => (
          <BusCard
            key={bus.id}
            bus={bus}
            onViewDetails={openDetails}
            onDelete={setBusPendingDelete}
          />
        ))}
      </div>

      {selectedBus && (
        <BusDetailsModal
          bus={selectedBus}
          mode={modalMode}
          onClose={() => setSelectedBus(undefined)}
          onSave={saveBus}
          availableDrivers={availableDrivers}
        />
      )}

      {busPendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-[#E5EAF0]/80 bg-white p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#DC2626]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">
                  Excluir ônibus
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Deseja excluir o ônibus {busPendingDelete.plate}? Esta ação
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
                onClick={() => setBusPendingDelete(undefined)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="h-9 cursor-pointer rounded-xl bg-[#DC2626] px-4 text-xs font-semibold text-white shadow-[0_16px_36px_-20px_rgba(220,38,38,0.9)] hover:bg-red-700"
                onClick={() => {
                  setBuses((currentBuses) =>
                    currentBuses.filter(
                      (bus) => bus.id !== busPendingDelete.id,
                    ),
                  );
                  setBusPendingDelete(undefined);
                }}
              >
                Excluir ônibus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
