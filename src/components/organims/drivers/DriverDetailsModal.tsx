import { Bus, Calendar, FileText, IdCard, Mail, Send } from "lucide-react";
import DriverInfoItem from "@/components/atom/DriverInfoItem";
import DriverHeader from "@/components/molecules/drivers/DriverHeader";
import type { Driver } from "@/types/entites/Driver";

interface DriverDetailsModalProps {
  driver: Driver;
  open: boolean;
  onClose: () => void;
  onEdit: (driver: Driver) => void;
}

export default function DriverDetailsModal({
  driver,
  open,
  onClose,
  onEdit,
}: DriverDetailsModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="driver-details-title"
    >
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[780px] overflow-hidden rounded-2xl shadow-2xl">
        <DriverHeader driver={driver} onClose={onClose} />

        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-6">
          <DriverInfoItem
            icon={<IdCard className="h-5 w-5" />}
            label="CPF"
            value={driver.cpf}
          />
          <DriverInfoItem
            icon={<Mail className="h-5 w-5" />}
            label="E-mail"
            value={driver.email}
          />
          <DriverInfoItem
            icon={<Send className="h-5 w-5" />}
            label="Viagens realizadas"
            value={String(driver.totalTrips)}
          />
          <DriverInfoItem
            icon={<Calendar className="h-5 w-5" />}
            label="Admissão"
            value={driver.admissionDate}
          />
          <DriverInfoItem
            icon={<Bus className="h-5 w-5" />}
            label="Ônibus"
            value={driver.busPlate}
          />
          <DriverInfoItem
            icon={<FileText className="h-5 w-5" />}
            label="Documentação"
            value={driver.documentationStatus}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={() => onEdit(driver)}
            className="cursor-pointer rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Editar cadastro
          </button>
        </div>
      </div>
    </div>
  );
}
