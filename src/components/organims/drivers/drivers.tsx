"use client";

import { AlertTriangle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import DriverCard from "@/components/molecules/drivers/DriverCard";
import DriverDetailsModal from "@/components/molecules/drivers/DriverDetailsModal";
import { Button } from "@/components/ui/button";
import type {
  DriverCreateFormData,
  DriverFormData,
} from "@/lib/schemas/driverSchema";
import { changeBusDriver } from "@/service/BusService";
import {
  createNewDriver,
  deactivateDriver,
  listDrivers,
  updateDriverInfo,
} from "@/service/UserService";
import type { DriverEntity } from "@/types/entites/DriverEntity";
import { DriverStatus, DriverStatusMap } from "@/types/enums/DriverStatus";

const initialDrivers: DriverEntity[] = [
  {
    id: "driver-001",
    initials: "CM",
    name: "Carlos Mendes",
    score: 4.9,
    completedTrips: 312,
    bus: { id: 1, prefectureId: 1, capacity: 2, plate: "123" },
    documentationStatus: "Docs: Em dia",
    status: DriverStatus.AVAILABLE,
    cpf: "123.456.789-00",
    email: "carlos.mendes@rotafacil.com",
    createdAt: "12/03/2022",
  },
  {
    id: "driver-002",
    initials: "AL",
    name: "Ana Lima",
    score: 4.8,
    completedTrips: 281,
    bus: { id: 1, prefectureId: 1, capacity: 2, plate: "123" },
    documentationStatus: "Docs: Em dia",
    status: DriverStatus.ON_ROUTE,
    cpf: "234.567.890-11",
    email: "ana.lima@rotafacil.com",
    createdAt: "04/07/2021",
  },
  {
    id: "driver-003",
    initials: "PR",
    name: "Pedro Rocha",
    score: 4.7,
    completedTrips: 156,
    bus: { id: 1, prefectureId: 1, capacity: 2, plate: "123" },
    documentationStatus: "Docs: Em dia",
    status: DriverStatus.ON_ROUTE,
    cpf: "345.678.901-22",
    email: "pedro.rocha@rotafacil.com",
    createdAt: "19/11/2023",
  },
  {
    id: "driver-004",
    initials: "MC",
    name: "Marina Costa",
    score: 4.6,
    completedTrips: 198,
    bus: { id: 1, prefectureId: 1, capacity: 2, plate: "123" },
    documentationStatus: "Docs: Pendente",
    status: DriverStatus.AVAILABLE,
    cpf: "456.789.012-33",
    email: "marina.costa@rotafacil.com",
    createdAt: "27/05/2022",
  },
  {
    id: "driver-005",
    initials: "RS",
    name: "Roberto Silva",
    score: 4.9,
    completedTrips: 402,
    bus: { id: 1, prefectureId: 1, capacity: 2, plate: "123" },
    documentationStatus: "Docs: Em dia",
    status: DriverStatus.ON_ROUTE,
    cpf: "567.890.123-44",
    email: "roberto.silva@rotafacil.com",
    createdAt: "02/02/2020",
  },
  {
    id: "driver-006",
    initials: "JA",
    name: "Juliana Alves",
    score: 5.0,
    completedTrips: 89,
    bus: { id: 1, prefectureId: 1, capacity: 2, plate: "123" },
    documentationStatus: "Docs: Em dia",
    status: DriverStatus.ON_ROUTE,
    cpf: "678.901.234-55",
    email: "juliana.alves@rotafacil.com",
    createdAt: "15/09/2024",
  },
];

function buildInitials(name: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "??";
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<DriverEntity[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverEntity>();
  const [modalMode, setModalMode] = useState<"details" | "create">("details");
  const [driverPendingDelete, setDriverPendingDelete] =
    useState<DriverEntity>();

  useEffect(() => {
    async function listDriversFromService() {
      setDrivers(await listDrivers());
    }
    listDriversFromService();
  }, []);

  function openDetails(driver: DriverEntity) {
    setModalMode("details");
    setSelectedDriver(driver);
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedDriver({
      id: crypto.randomUUID(),
      initials: "",
      name: "",
      score: 0,
      completedTrips: 0,
      documentationStatus: "Docs: Em dia",
      status: DriverStatus.ON_ROUTE,
      cpf: "",
      email: "",
      createdAt: new Date().toLocaleDateString("pt-BR"),
    });
  }

  async function editDriver(updatedFields: DriverFormData) {
    if (!selectedDriver) return;

    await updateDriverInfo(selectedDriver.id, {
      name: updatedFields.name,
      email: updatedFields.email,
      cpf: updatedFields.cpf,
    });

    if (
      updatedFields.busId &&
      String(selectedDriver.bus?.id ?? "") !== updatedFields.busId
    ) {
      await changeBusDriver(selectedDriver.id, {
        busId: updatedFields.busId,
      });
    }

    const drivers = await listDrivers();
    setDrivers(drivers);
    setSelectedDriver(
      drivers.find((driver) => driver.id === selectedDriver.id),
    );
  }

  async function createDriver(data: DriverCreateFormData) {
    if (!selectedDriver) return;

    await createNewDriver({
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      password: data.password,
    });

    setDrivers(await listDrivers());
    setSelectedDriver(undefined);
  }

  async function deleteDriver(driver: DriverEntity) {
    await deactivateDriver(driver.id);
    setDriverPendingDelete(undefined);
    setDrivers(await listDrivers());
  }

  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-950">
            Motoristas
          </p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Cadastre motoristas, gerencie documentos e acompanhe viagens.
          </p>
        </div>

        <Button
          type="button"
          size="xs"
          className="h-10 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 text-sm font-semibold text-white shadow-[0_0_24px_-14px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
          onClick={openCreateModal}
        >
          <Plus className="h-3.5 w-3.5" />
          Novo motorista
        </Button>
      </div>

      <p className="text-sm font-medium text-slate-500">
        {drivers.length} motorista(s) cadastrado(s)
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.id}
            initials={driver.name[0].toUpperCase()}
            name={driver.name}
            rating={driver.score}
            trips={driver.completedTrips}
            vehicle={driver.bus?.plate ?? "-"}
            documentsStatus={driver.documentationStatus}
            status={driver.status}
            onViewProfile={() => openDetails(driver)}
            onDelete={() => setDriverPendingDelete(driver)}
          />
        ))}
      </div>

      {selectedDriver && (
        <DriverDetailsModal
          driver={selectedDriver}
          open={!!selectedDriver}
          mode={modalMode}
          onClose={() => setSelectedDriver(undefined)}
          onEdit={editDriver}
          onCreate={createDriver}
        />
      )}

      {driverPendingDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-[#E5EAF0]/80 bg-white p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#DC2626]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">
                  Excluir motorista
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Deseja excluir {driverPendingDelete.name}? Esta ação remove o
                  motorista da listagem.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                onClick={() => setDriverPendingDelete(undefined)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="h-9 cursor-pointer rounded-xl bg-[#DC2626] px-4 text-xs font-semibold text-white shadow-[0_16px_36px_-20px_rgba(220,38,38,0.9)] hover:bg-red-700"
                onClick={() => deleteDriver(driverPendingDelete)}
              >
                Excluir motorista
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
