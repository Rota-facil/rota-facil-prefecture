import {
  Bus,
  Calendar,
  FileText,
  IdCard,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
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
    <button
      type="button"
      aria-label="Fechar modal"
      className="fixed inset-0 z-50 flex w-full cursor-default items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[780px] overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DriverHeader driver={driver} onClose={onClose} />

        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-6">
          <DriverInfoItem
            icon={<IdCard className="h-5 w-5" />}
            label="CPF"
            value={driver.cpf}
          />
          <DriverInfoItem
            icon={<IdCard className="h-5 w-5" />}
            label="CNH"
            value={`${driver.cnh} (Cat. ${driver.cnhCategory})`}
          />
          <DriverInfoItem
            icon={<Phone className="h-5 w-5" />}
            label="Telefone"
            value={driver.phone}
          />
          <DriverInfoItem
            icon={<Mail className="h-5 w-5" />}
            label="E-mail"
            value={driver.email}
          />
          <DriverInfoItem
            icon={<MapPin className="h-5 w-5" />}
            label="Endereço"
            value={driver.address}
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
    </button>
  );
}
