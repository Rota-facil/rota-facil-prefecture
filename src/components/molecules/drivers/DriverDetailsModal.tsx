"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bus,
  Calendar,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  IdCard,
  Lock,
  Mail,
  Send,
  User,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import DriverInfoItem from "@/components/atom/DriverInfoItem";
import DriverHeader from "@/components/molecules/drivers/DriverHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type DriverCreateFormData,
  type DriverFormData,
  driverCreateSchema,
  driverSchema,
} from "@/lib/schemas/driverSchema";
import type { Driver } from "@/types/entites/Driver";

const busOptions = ["ABC-1D45", "QRT-2H88", "XYZ-9P12", "JKL-3F77"];

interface DriverDetailsModalProps {
  driver: Driver;
  open: boolean;
  mode?: "details" | "create";
  onClose: () => void;
  onEdit: (data: DriverFormData) => void;
  onCreate?: (data: DriverCreateFormData) => void;
}

export default function DriverDetailsModal({
  driver,
  open,
  mode = "details",
  onClose,
  onEdit,
  onCreate,
}: DriverDetailsModalProps) {
  const isCreating = mode === "create";
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
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

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors, isSubmitting: isSubmittingCreate },
  } = useForm<DriverCreateFormData>({
    resolver: zodResolver(driverCreateSchema),
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      password: "",
    },
  });

  const selectedBusPlate = useWatch({ control, name: "busPlate" });

  useEffect(() => {
    if (!isCreating) {
      reset({
        name: driver.name,
        cpf: driver.cpf,
        email: driver.email,
        busPlate: driver.busPlate,
      });
    }
  }, [driver, isCreating, reset]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleClose() {
    setIsEditing(false);
    setIsSelectOpen(false);
    setShowPassword(false);
    reset();
    resetCreate();
    onClose();
  }

  function handleSubmitEdit(data: DriverFormData) {
    onEdit(data);
    setIsEditing(false);
    setIsSelectOpen(false);
  }

  function handleSubmitCreateForm(data: DriverCreateFormData) {
    onCreate?.(data);
    resetCreate();
    setShowPassword(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="driver-details-title"
    >
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-md"
        onClick={handleClose}
      />

      <div className="relative z-10 max-h-[88vh] w-full max-w-[820px] overflow-hidden rounded-3xl border border-[#E5EAF0]/80 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
        {isCreating ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] px-6 py-5 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.26),transparent_34%),radial-gradient(circle_at_84%_30%,rgba(255,255,255,0.16),transparent_32%)]" />
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="absolute right-4 top-4 h-8 w-8 cursor-pointer rounded-xl text-white/80 hover:bg-white/15 hover:text-white"
              aria-label="Fechar detalhes"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="relative flex items-start gap-4 pr-10">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold">Novo motorista</p>
                <p className="mt-1 text-sm text-white/75">
                  Informe nome, e-mail, CPF e senha do motorista.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DriverHeader driver={driver} onClose={handleClose} />
        )}

        <div className="max-h-[calc(88vh-116px)] overflow-y-auto [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
          {isCreating ? (
            <form onSubmit={handleSubmitCreate(handleSubmitCreateForm)}>
              <div className="p-6">
                <p className="text-sm font-semibold text-slate-950">
                  Dados do motorista
                </p>
                <p className="text-xs text-slate-500">
                  Nome, e-mail, CPF e senha usados no acesso do motorista.
                </p>

                <div className="mt-4 grid gap-4">
                  <div>
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-[#1E3A8A]" />
                      <label
                        htmlFor="driver-create-name"
                        className="text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                      >
                        Nome do motorista
                      </label>
                    </div>
                    <Input
                      id="driver-create-name"
                      placeholder="Ex: João da Silva"
                      {...registerCreate("name")}
                      className="h-10 rounded-xl border-[#E5EAF0] bg-white px-3 text-sm"
                    />
                    {createErrors.name && (
                      <span className="mt-1 block text-[11px] font-medium text-[#DC2626]">
                        {createErrors.name.message}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-[#1E3A8A]" />
                        <label
                          htmlFor="driver-create-email"
                          className="text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                        >
                          E-mail
                        </label>
                      </div>
                      <Input
                        id="driver-create-email"
                        type="email"
                        placeholder="motorista@rotafacil.com"
                        {...registerCreate("email")}
                        className="h-10 rounded-xl border-[#E5EAF0] bg-white px-3 text-sm"
                      />
                      {createErrors.email && (
                        <span className="mt-1 block text-[11px] font-medium text-[#DC2626]">
                          {createErrors.email.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <IdCard className="h-3.5 w-3.5 text-[#1E3A8A]" />
                        <label
                          htmlFor="driver-create-cpf"
                          className="text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                        >
                          CPF
                        </label>
                      </div>
                      <Input
                        id="driver-create-cpf"
                        placeholder="123.456.789-00"
                        {...registerCreate("cpf")}
                        className="h-10 rounded-xl border-[#E5EAF0] bg-white px-3 font-mono text-sm"
                      />
                      {createErrors.cpf && (
                        <span className="mt-1 block text-[11px] font-medium text-[#DC2626]">
                          {createErrors.cpf.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-[#1E3A8A]" />
                      <label
                        htmlFor="driver-create-password"
                        className="text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                      >
                        Senha
                      </label>
                    </div>
                    <div className="relative">
                      <Input
                        id="driver-create-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo de 6 caracteres"
                        {...registerCreate("password")}
                        className="h-10 rounded-xl border-[#E5EAF0] bg-white px-3 pr-10 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={
                          showPassword ? "Ocultar senha" : "Mostrar senha"
                        }
                        className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#EEF2F7] hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {createErrors.password && (
                      <span className="mt-1 block text-[11px] font-medium text-[#DC2626]">
                        {createErrors.password.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#E5EAF0] bg-white px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                  onClick={handleClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="xs"
                  disabled={isSubmittingCreate}
                  className="h-9 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 text-xs font-semibold text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cadastrar motorista
                </Button>
              </div>
            </form>
          ) : isEditing ? (
            <form onSubmit={handleSubmit(handleSubmitEdit)}>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-6">
                <div className="flex items-center gap-4 rounded-2xl border border-[#E5EAF0] bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Nome do motorista
                    </span>
                    <input
                      {...register("name")}
                      className="h-9 w-full rounded-xl border border-[#E5EAF0] bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30"
                    />
                    {errors.name && (
                      <span className="text-[11px] font-medium text-[#DC2626]">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-[#E5EAF0] bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                    <IdCard className="h-5 w-5" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      CPF
                    </span>
                    <input
                      {...register("cpf")}
                      className="h-9 w-full rounded-xl border border-[#E5EAF0] bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30"
                    />
                    {errors.cpf && (
                      <span className="text-[11px] font-medium text-[#DC2626]">
                        {errors.cpf.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-[#E5EAF0] bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      E-mail
                    </span>
                    <input
                      {...register("email")}
                      className="h-9 w-full rounded-xl border border-[#E5EAF0] bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition-all focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30"
                    />
                    {errors.email && (
                      <span className="text-[11px] font-medium text-[#DC2626]">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-[#E5EAF0] bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E3A8A]">
                    <Bus className="h-5 w-5" />
                  </div>
                  <div
                    className="relative flex flex-1 flex-col gap-1"
                    ref={selectRef}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Ônibus
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                      className={`flex h-9 w-full items-center justify-between rounded-xl border bg-white px-3 text-left text-sm font-semibold text-slate-800 outline-none transition-all ${
                        isSelectOpen
                          ? "border-[#3B82F6] ring-2 ring-[#3B82F6]/30"
                          : "border-[#E5EAF0]"
                      }`}
                    >
                      <span>{selectedBusPlate || "Selecione um ônibus"}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isSelectOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isSelectOpen && (
                      <div className="absolute left-0 right-0 top-[105%] z-30 mt-1 max-h-60 overflow-auto rounded-xl border border-[#E5EAF0] bg-white p-1 shadow-[0_16px_36px_-20px_rgba(15,23,42,0.35)] animate-in fade-in slide-in-from-top-1 duration-150">
                        {busOptions.map((plate) => {
                          const isSelected = plate === selectedBusPlate;
                          return (
                            <button
                              key={plate}
                              type="button"
                              onClick={() => {
                                setValue("busPlate", plate, {
                                  shouldValidate: true,
                                });
                                setIsSelectOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                                isSelected
                                  ? "bg-[#1E3A8A] text-white"
                                  : "text-slate-700 hover:bg-[#EEF2F7]"
                              }`}
                            >
                              <span>{plate}</span>
                              {isSelected && <Check className="h-4 w-4" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <input type="hidden" {...register("busPlate")} />

                    {errors.busPlate && (
                      <span className="text-[11px] font-medium text-[#DC2626]">
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

              <div className="flex items-center justify-end gap-2 border-t border-[#E5EAF0] bg-white px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                  onClick={() => {
                    setIsEditing(false);
                    reset({
                      name: driver.name,
                      cpf: driver.cpf,
                      email: driver.email,
                      busPlate: driver.busPlate,
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="xs"
                  disabled={isSubmitting}
                  className="h-9 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 text-xs font-semibold text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Salvar alterações
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-6">
                <DriverInfoItem
                  icon={<User className="h-5 w-5" />}
                  label="Nome do motorista"
                  value={driver.name}
                />
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
                  icon={<Bus className="h-5 w-5" />}
                  label="Ônibus"
                  value={driver.busPlate}
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
                  icon={<FileText className="h-5 w-5" />}
                  label="Documentação"
                  value={driver.documentationStatus}
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#E5EAF0] bg-white px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                  onClick={onClose}
                >
                  Fechar
                </Button>
                <Button
                  type="button"
                  size="xs"
                  className="h-9 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 text-xs font-semibold text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
                  onClick={() => setIsEditing(true)}
                >
                  Editar cadastro
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
