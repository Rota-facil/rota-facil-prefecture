"use client";

import { AlertTriangle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import BusCard from "@/components/molecules/bus/BusCard";
import BusDetailsModal from "@/components/molecules/bus/BusDetailsModal";
import { Button } from "@/components/ui/button";
import { createBus, deleteBus, listBus, updateBus } from "@/service/BusService";
import { listDrivers } from "@/service/UserService";
import type { BusEntity } from "@/types/entites/BusEntity";
import type { DriverEntity } from "@/types/entites/DriverEntity";
import type { PrefectureEntity } from "@/types/entites/PrefectureEntity";
import type { CreateBusRequest } from "@/types/request/CreateBusRequest";

const prefecture: PrefectureEntity = {
  id: "prefecture-001",
  name: "Prefeitura Municipal",
};

function createEmptyBus(): BusEntity {
  return {
    id: crypto.randomUUID(),
    prefectureId: prefecture.id,
    driver: null,
    capacity: 1,
    plate: "",
    status: "OPERATION",
    createdAt: new Date(),
  };
}

export default function Bus() {
  const [availableDrivers, setAvailableDrivers] = useState<DriverEntity[]>([]);
  const [buses, setBuses] = useState<BusEntity[]>([]);
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

  async function createBusFromService(request: CreateBusRequest) {
    const busCreated = await createBus(request);
    setSelectedBus(busCreated);
    setModalMode("details");
    setBuses(await listBus());
  }

  async function saveBus(updatedBus: BusEntity) {
    const savedBus = await updateBus(updatedBus.id, {
      plate: updatedBus.plate,
      capacity: updatedBus.capacity,
      status: updatedBus.status ?? "OUT_OF_OPERATION",
      driverId: updatedBus.driver?.id ? String(updatedBus.driver.id) : null,
    });

    const updatedBuses = await listBus();
    setBuses(updatedBuses);
    setAvailableDrivers(await listDrivers());
    setModalMode("details");
    setSelectedBus(
      updatedBuses.find((bus) => bus.id === savedBus.id) ?? savedBus,
    );
  }

  async function deleteBusFromService(bus: BusEntity) {
    await deleteBus(bus.id);
    setBusPendingDelete(undefined);
    setBuses(await listBus());
    setAvailableDrivers(await listDrivers());
    if (selectedBus?.id === bus.id) {
      setSelectedBus(undefined);
    }
  }

  useEffect(() => {
    async function fetchResources() {
      setBuses(await listBus());
      setAvailableDrivers(await listDrivers());
    }
    fetchResources();
  }, []);
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
          onCreate={createBusFromService}
          availableDrivers={availableDrivers}
        />
      )}

      {busPendingDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
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
                  Deseja excluir o ônibus {busPendingDelete.plate}? Ele será
                  desativado e removido das rotas recorrentes.
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
                onClick={() => deleteBusFromService(busPendingDelete)}
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
