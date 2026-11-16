import type { VehicleType } from "@/types/entites/VehicleEntity";

const vehicleTypeLabels: Record<VehicleType, string> = {
  BUS: "Ônibus",
  CAR: "Carro",
  VAN: "Van",
};

export function formatVehicleType(vehicleType?: string | null): string {
  if (!vehicleType) return "Tipo não informado";

  return vehicleTypeLabels[vehicleType as VehicleType] ?? vehicleType;
}
