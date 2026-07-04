"use client";

import { useState } from "react";
import DriverCard from "@/components/molecules/drivers/DriverCard";
import DriverDetailsModal from "@/components/organims/drivers/DriverDetailsModal";
import type { DriverFormData } from "@/lib/schemas/driverSchema";
import type { Driver } from "@/types/entites/Driver";

const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Carlos Mendes",
    initials: "CM",
    rating: 4.9,
    totalTrips: 312,
    status: "onRoute",
    cpf: "123.456.789-00",
    email: "carlos.mendes@rotafacil.gov",
    admissionDate: "12/03/2019",
    busPlate: "ABC-1D45",
    documentationStatus: "Em dia",
  },
  {
    id: "2",
    name: "Ana Lima",
    initials: "AL",
    rating: 4.8,
    totalTrips: 281,
    status: "available",
    cpf: "987.654.321-00",
    email: "ana.lima@rotafacil.gov",
    admissionDate: "05/07/2020",
    busPlate: "QRT-2H88",
    documentationStatus: "Em dia",
  },
];

export default function Home() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  function handleEdit(data: DriverFormData) {
    console.log("Salvar edição:", data);
    setSelectedDriver(null);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-100 p-10">
      <div className="flex flex-wrap justify-center gap-5">
        {mockDrivers.map((driver) => (
          <DriverCard
            key={driver.id}
            initials={driver.initials}
            name={driver.name}
            rating={driver.rating}
            trips={driver.totalTrips}
            vehicle={driver.busPlate}
            documentsStatus={`Docs: ${driver.documentationStatus}`}
            status={driver.status}
            onViewProfile={() => setSelectedDriver(driver)}
            onDelete={() => console.log("Excluir:", driver.id)}
          />
        ))}
      </div>

      {selectedDriver && (
        <DriverDetailsModal
          driver={selectedDriver}
          open={!!selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onEdit={handleEdit}
        />
      )}
    </main>
  );
}
