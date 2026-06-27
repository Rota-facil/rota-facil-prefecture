"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import FormField from "@/components/atom/FormField";
import { Input } from "@/components/ui/input";
import { type DriverFormData, driverSchema } from "@/lib/schemas/driverSchema";
import type { Driver } from "@/types/entites/Driver";

interface DriverFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DriverFormData) => void;
  defaultValues?: Partial<Driver>;
  mode?: "create" | "edit";
}

export default function DriverFormModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
  mode = "create",
}: DriverFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: defaultValues ?? {},
  });

  function handleClose() {
    reset();
    onClose();
  }

  if (!open) return null;

  return (
    <button
      type="button"
      aria-label="Fechar modal"
      className="fixed inset-0 z-50 flex w-full cursor-default items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[780px] overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 px-7 py-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === "create" ? "Cadastrar motorista" : "Editar cadastro"}
          </h2>
          <p className="mt-1 text-sm text-blue-100">
            {mode === "create"
              ? "Preencha os dados para adicionar um novo motorista"
              : "Atualize os dados do motorista"}
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6">
            <FormField label="Nome completo" error={errors.name?.message}>
              <Input
                {...register("name")}
                placeholder="Carlos Mendes"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>

            <FormField label="CPF" error={errors.cpf?.message}>
              <Input
                {...register("cpf")}
                placeholder="123.456.789-00"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>

            <FormField label="CNH" error={errors.cnh?.message}>
              <Input
                {...register("cnh")}
                placeholder="01234567890"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>

            <FormField
              label="Categoria CNH"
              error={errors.cnhCategory?.message}
            >
              <Input
                {...register("cnhCategory")}
                placeholder="D"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>

            <FormField label="Telefone" error={errors.phone?.message}>
              <Input
                {...register("phone")}
                placeholder="(31) 99999-1234"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>

            <FormField label="E-mail" error={errors.email?.message}>
              <Input
                {...register("email")}
                placeholder="carlos@rotafacil.gov"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>

            <FormField label="Endereço" error={errors.address?.message}>
              <Input
                {...register("address")}
                placeholder="Rua das Acácias, 120 — Centro"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>

            <FormField
              label="Data de admissão"
              error={errors.admissionDate?.message}
            >
              <Input
                {...register("admissionDate")}
                placeholder="12/03/2019"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>

            <FormField label="Placa do ônibus" error={errors.busPlate?.message}>
              <Input
                {...register("busPlate")}
                placeholder="ABC-1D45"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>

            <FormField
              label="Documentação"
              error={errors.documentationStatus?.message}
            >
              <Input
                {...register("documentationStatus")}
                placeholder="Em dia"
                className="rounded-xl border-slate-200 bg-white"
              />
            </FormField>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded-full border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {mode === "create" ? "Cadastrar" : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </button>
  );
}
