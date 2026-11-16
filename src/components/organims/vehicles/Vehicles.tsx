"use client";

import { AlertTriangle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import VehicleCard from "@/components/molecules/vehicles/VehicleCard";
import VehicleDetailsModal from "@/components/molecules/vehicles/VehicleDetailsModal";
import { Button } from "@/components/ui/button";
import {
  listEntityPhotos,
  uploadEntityPhoto,
} from "@/service/EntityPhotoService";
import { listDrivers } from "@/service/UserService";
import {
  createVehicle,
  deleteVehicle,
  listVehicles,
  updateVehicle,
} from "@/service/VehicleService";
import type { DriverEntity } from "@/types/entites/DriverEntity";
import type { PrefectureEntity } from "@/types/entites/PrefectureEntity";
import type { VehicleEntity } from "@/types/entites/VehicleEntity";
import type { CreateVehicleRequest } from "@/types/request/CreateVehicleRequest";

const prefecture: PrefectureEntity = {
  id: "prefecture-001",
  name: "Prefeitura Municipal",
};

function createEmptyVehicle(): VehicleEntity {
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

export default function Vehicles() {
  const [availableDrivers, setAvailableDrivers] = useState<DriverEntity[]>([]);
  const [vehicles, setVehicles] = useState<VehicleEntity[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleEntity>();
  const [modalMode, setModalMode] = useState<"details" | "create" | "edit">(
    "details",
  );
  const [vehiclePendingDelete, setVehiclePendingDelete] =
    useState<VehicleEntity>();
  const [vehiclePhotoUrls, setVehiclePhotoUrls] = useState<
    Record<string, string>
  >({});

  function openDetails(vehicle: VehicleEntity) {
    setModalMode("details");
    setSelectedVehicle(vehicle);
  }

  function openCreateModal() {
    setModalMode("create");
    setSelectedVehicle(createEmptyVehicle());
  }

  async function createVehicleFromService(
    request: CreateVehicleRequest,
    photo?: File,
  ) {
    const vehicleCreated = await createVehicle(request);
    if (photo) {
      const uploadedPhoto = await uploadEntityPhoto(
        "vehicles",
        String(vehicleCreated.id),
        photo,
      );
      setVehiclePhotoUrls((current) => ({
        ...current,
        [String(vehicleCreated.id)]: uploadedPhoto.url,
      }));
    }
    setSelectedVehicle(vehicleCreated);
    setModalMode("details");
    setVehicles(await listVehicles());
  }

  async function saveVehicle(updatedVehicle: VehicleEntity, photo?: File) {
    const savedVehicle = await updateVehicle(updatedVehicle.id, {
      plate: updatedVehicle.plate,
      capacity: updatedVehicle.capacity,
      status: updatedVehicle.status ?? "OUT_OF_OPERATION",
      driverId: updatedVehicle.driver?.id
        ? String(updatedVehicle.driver.id)
        : null,
    });

    const updatedVehicles = await listVehicles();
    if (photo) {
      const uploadedPhoto = await uploadEntityPhoto(
        "vehicles",
        String(savedVehicle.id),
        photo,
      );
      setVehiclePhotoUrls((current) => ({
        ...current,
        [String(savedVehicle.id)]: uploadedPhoto.url,
      }));
    }
    setVehicles(updatedVehicles);
    setAvailableDrivers(await listDrivers());
    setModalMode("details");
    setSelectedVehicle(
      updatedVehicles.find((vehicle) => vehicle.id === savedVehicle.id) ??
        savedVehicle,
    );
  }

  async function deleteVehicleFromService(vehicle: VehicleEntity) {
    await deleteVehicle(vehicle.id);
    setVehiclePendingDelete(undefined);
    setVehicles(await listVehicles());
    setAvailableDrivers(await listDrivers());
    if (selectedVehicle?.id === vehicle.id) {
      setSelectedVehicle(undefined);
    }
  }

  useEffect(() => {
    async function fetchResources() {
      const vehiclesFound = await listVehicles();
      setVehicles(vehiclesFound);
      const photos = await Promise.all(
        vehiclesFound.map(async (vehicle) => {
          const files = await listEntityPhotos("vehicles", String(vehicle.id));
          return [String(vehicle.id), files[0]?.url] as const;
        }),
      );
      setVehiclePhotoUrls((current) => ({
        ...current,
        ...Object.fromEntries(photos.filter(([, url]) => url)),
      }));
      setAvailableDrivers(await listDrivers());
    }
    fetchResources();
  }, []);
  return (
    <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col gap-6 bg-slate-50 px-6 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-slate-950">
            Veículo
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
          Novo veículo
        </Button>
      </div>

      <p className="text-sm font-medium text-slate-500">
        {vehicles.length} veículo cadastrado(s)
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            photoUrl={vehiclePhotoUrls[String(vehicle.id)]}
            onViewDetails={openDetails}
            onDelete={setVehiclePendingDelete}
          />
        ))}
      </div>

      {selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          photoUrl={vehiclePhotoUrls[String(selectedVehicle.id)]}
          mode={modalMode}
          onClose={() => setSelectedVehicle(undefined)}
          onSave={saveVehicle}
          onCreate={createVehicleFromService}
          availableDrivers={availableDrivers}
        />
      )}

      {vehiclePendingDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-[#E5EAF0]/80 bg-white p-6 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#DC2626]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">
                  Excluir veículo
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Deseja excluir o veículo {vehiclePendingDelete.plate}? Ele
                  será desativado e removido das rotas recorrentes.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                onClick={() => setVehiclePendingDelete(undefined)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                className="h-9 cursor-pointer rounded-xl bg-[#DC2626] px-4 text-xs font-semibold text-white shadow-[0_16px_36px_-20px_rgba(220,38,38,0.9)] hover:bg-red-700"
                onClick={() => deleteVehicleFromService(vehiclePendingDelete)}
              >
                Excluir veículo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
