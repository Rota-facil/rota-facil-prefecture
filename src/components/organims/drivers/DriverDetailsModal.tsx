"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bus, Calendar, FileText, IdCard, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import DriverInfoItem from "@/components/atom/DriverInfoItem";
import DriverHeader from "@/components/molecules/drivers/DriverHeader";
import { type DriverFormData, driverSchema } from "@/lib/schemas/driverSchema";
import type { Driver } from "@/types/entites/Driver";

const busOptions = ["ABC-1D45", "QRT-2H88", "XYZ-9P12", "JKL-3F77"];

interface DriverDetailsModalProps {
  driver: Driver;
  open: boolean;
  onClose: () => void;
  onEdit: (data: DriverFormData) => void;
}

export default function DriverDetailsModal({
  driver,
  open,
  onClose,
  onEdit,
}: DriverDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: driver.name,
      cpf: driver.cpf,
      email: driver.email,
      busPlate: driver.busPlate,
    },
  });

  function handleClose() {
    setIsEditing(false);
    reset();
    onClose();
  }

  function handleSubmitEdit(data: DriverFormData) {
    onEdit(data);
    setIsEditing(false);
  }

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
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-[780px] overflow-hidden rounded-2xl shadow-2xl">
        <DriverHeader driver={driver} onClose={handleClose} />

        {isEditing ? (
          <form onSubmit={handleSubmit(handleSubmitEdit)}>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-6">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <IdCard className="h-5 w-5" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Nome
                  </span>
                  <input
                    {...register("name")}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <span className="text-[11px] text-red-500">
                      {errors.name.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <IdCard className="h-5 w-5" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    CPF
                  </span>
                  <input
                    {...register("cpf")}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.cpf && (
                    <span className="text-[11px] text-red-500">
                      {errors.cpf.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    E-mail
                  </span>
                  <input
                    {...register("email")}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <span className="text-[11px] text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Bus className="h-5 w-5" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Ônibus
                  </span>
                  <select
                    {...register("busPlate")}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {busOptions.map((plate) => (
                      <option key={plate} value={plate}>
                        {plate}
                      </option>
                    ))}
                  </select>
                  {errors.busPlate && (
                    <span className="text-[11px] text-red-500">
                      {errors.busPlate.message}
                    </span>
                  )}
                </div>
              </div>

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
                icon={<FileText className="h-5 w-5" />}
                label="Documentação"
                value={driver.documentationStatus}
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
                className="cursor-pointer rounded-full border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        ) : (
          <>
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
                onClick={() => setIsEditing(true)}
                className="cursor-pointer rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Editar cadastro
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
