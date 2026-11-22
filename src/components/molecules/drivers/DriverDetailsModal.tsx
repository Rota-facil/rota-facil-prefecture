"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Car,
  Check,
  ChevronDown,
  FileText,
  IdCard,
  ImagePlus,
  Mail,
  Send,
  User,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import DocumentPreview from "@/components/atom/DocumentPreview";
import DriverInfoItem from "@/components/atom/DriverInfoItem";
import DriverHeader from "@/components/molecules/drivers/DriverHeader";
import UserFeedbackPanel from "@/components/molecules/feedbacks/UserFeedbackPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDocumentStatus } from "@/lib/documentStatus";
import {
  type DriverCreateFormData,
  type DriverFormData,
  driverCreateSchema,
  driverSchema,
} from "@/lib/schemas/driverSchema";
import { formatVehicleType } from "@/lib/vehicleType";

import {
  type DriverDocument,
  evaluateDriverDocument,
  fetchDriverCnh,
} from "@/service/DriverDocumentService";
import { listVehicles } from "@/service/VehicleService";
import type { DriverEntity } from "@/types/entites/DriverEntity";
import type { VehicleEntity } from "@/types/entites/VehicleEntity";

const documentEvaluationButtonStyles = {
  ANALYSIS: {
    inactive:
      "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100",
    active: "border-amber-500 bg-amber-500 text-white hover:bg-amber-600",
  },
  APPROVED: {
    inactive:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100",
    active: "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700",
  },
  REJECTED: {
    inactive:
      "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
    active: "border-red-600 bg-red-600 text-white hover:bg-red-700",
  },
} as const;

interface DriverDetailsModalProps {
  driver: DriverEntity;
  photoUrl?: string;
  open: boolean;
  mode?: "details" | "create";
  onClose: () => void;
  onEdit: (
    data: DriverFormData,
    photo?: File,
    cnh?: File,
  ) => void | Promise<void>;
  onDocumentChanged?: (status: DriverDocument["validationStatus"]) => void;
  onCreate?: (data: DriverCreateFormData, photo?: File, cnh?: File) => void;
}

export default function DriverDetailsModal({
  driver,
  photoUrl,
  open,
  mode = "details",
  onClose,
  onEdit,
  onCreate,
  onDocumentChanged,
}: DriverDetailsModalProps) {
  const isCreating = mode === "create";
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File>();
  const [selectedCnh, setSelectedCnh] = useState<File>();
  const [cnh, setCnh] = useState<DriverDocument | null>(null);
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
      vehicleId: driver.vehicle?.id ? String(driver.vehicle.id) : "",
    },
  });

  const [vehicleOptions, setVehicleOptions] = useState<VehicleEntity[]>([]);
  useEffect(() => {
    async function listVehiclesFromService() {
      setVehicleOptions(await listVehicles());
    }
    listVehiclesFromService();
  }, []);

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
    },
  });

  const selectedVehicleId = useWatch({ control, name: "vehicleId" });
  const selectedVehicle = vehicleOptions.find(
    (vehicle) => String(vehicle.id) === selectedVehicleId,
  );

  useEffect(() => {
    if (!isCreating) {
      reset({
        name: driver.name,
        cpf: driver.cpf,
        email: driver.email,
        vehicleId: driver.vehicle?.id ? String(driver.vehicle.id) : "",
      });
    }
  }, [driver, isCreating, reset]);

  useEffect(() => {
    if (isCreating) {
      setCnh(null);
      return;
    }
    fetchDriverCnh(driver.id)
      .then(setCnh)
      .catch(() => setCnh(null));
  }, [driver.id, isCreating]);

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
    reset();
    resetCreate();
    setSelectedPhoto(undefined);
    setSelectedCnh(undefined);
    onClose();
  }

  async function handleSubmitEdit(data: DriverFormData) {
    await onEdit(data, selectedPhoto, selectedCnh);
    setCnh(await fetchDriverCnh(driver.id));
    setIsEditing(false);
    setIsSelectOpen(false);
  }

  function handleSubmitCreateForm(data: DriverCreateFormData) {
    onCreate?.(data, selectedPhoto, selectedCnh);
    resetCreate();
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
                  Informe nome, e-mail e CPF do motorista. A senha será gerada
                  automaticamente.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <DriverHeader
            driver={driver}
            photoUrl={photoUrl}
            onClose={handleClose}
          />
        )}

        <div className="max-h-[calc(88vh-116px)] overflow-y-auto [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
          {isCreating ? (
            <form onSubmit={handleSubmitCreate(handleSubmitCreateForm)}>
              <div className="p-6">
                <p className="text-sm font-semibold text-slate-950">
                  Dados do motorista
                </p>
                <p className="text-xs text-slate-500">
                  Nome, e-mail e CPF do motorista. A senha será gerada
                  automaticamente.
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
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#CBD5E1] bg-slate-50 px-4 py-3 text-sm text-slate-600 hover:bg-slate-100">
                      <ImagePlus className="h-4 w-4 text-[#1E3A8A]" />
                      <span>{selectedPhoto?.name ?? "Foto do motorista"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) =>
                          setSelectedPhoto(event.target.files?.[0])
                        }
                      />
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#CBD5E1] bg-slate-50 px-4 py-3 text-sm text-slate-600 hover:bg-slate-100">
                      <FileText className="h-4 w-4 text-[#1E3A8A]" />
                      <span>{selectedCnh?.name ?? "CNH em PDF"}</span>
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        className="sr-only"
                        onChange={(event) =>
                          setSelectedCnh(event.target.files?.[0])
                        }
                      />
                    </label>
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
                    <Car className="h-5 w-5" />
                  </div>
                  <div
                    className="relative flex flex-1 flex-col gap-1"
                    ref={selectRef}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Veículo
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
                      <span>{selectedVehicle?.plate ?? "Sem veículo"}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isSelectOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isSelectOpen && (
                      <div className="absolute left-0 right-0 top-[105%] z-30 mt-1 max-h-60 overflow-auto rounded-xl border border-[#E5EAF0] bg-white p-1 shadow-[0_16px_36px_-20px_rgba(15,23,42,0.35)] animate-in fade-in slide-in-from-top-1 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setValue("vehicleId", "", {
                              shouldValidate: true,
                            });
                            setIsSelectOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                            !selectedVehicleId
                              ? "bg-[#1E3A8A] text-white"
                              : "text-slate-700 hover:bg-[#EEF2F7]"
                          }`}
                        >
                          <span>Sem veículo</span>
                          {!selectedVehicleId && <Check className="h-4 w-4" />}
                        </button>

                        {vehicleOptions.map((vehicle) => {
                          const isSelected =
                            String(vehicle.id) === selectedVehicleId;
                          return (
                            <button
                              key={vehicle.id}
                              type="button"
                              onClick={() => {
                                setValue("vehicleId", String(vehicle.id), {
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
                              <span>
                                {vehicle.plate} (
                                {formatVehicleType(vehicle.vehicleType)})
                              </span>
                              {isSelected && <Check className="h-4 w-4" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <input type="hidden" {...register("vehicleId")} />

                    {errors.vehicleId && (
                      <span className="text-[11px] font-medium text-[#DC2626]">
                        {errors.vehicleId.message}
                      </span>
                    )}
                  </div>
                </div>

                <DriverInfoItem
                  icon={<Send className="h-5 w-5" />}
                  label="Viagens realizadas"
                  value={String(driver.completedTrips)}
                />

                <DriverInfoItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Admissão"
                  value={driver.createdAt}
                />

                <div className="col-span-2 grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
                    <ImagePlus className="h-4 w-4 text-[#1E3A8A]" />
                    <span>{selectedPhoto?.name ?? "Alterar foto"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) =>
                        setSelectedPhoto(event.target.files?.[0])
                      }
                    />
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#CBD5E1] bg-white px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
                    <FileText className="h-4 w-4 text-[#1E3A8A]" />
                    <span>{selectedCnh?.name ?? "Alterar CNH"}</span>
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="sr-only"
                      onChange={(event) =>
                        setSelectedCnh(event.target.files?.[0])
                      }
                    />
                  </label>
                </div>
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
                      vehicleId: driver.vehicle?.id
                        ? String(driver.vehicle.id)
                        : "",
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
                  icon={<Car className="h-5 w-5" />}
                  label="Veículo"
                  value={
                    driver.vehicle
                      ? `${driver.vehicle.plate} (${formatVehicleType(driver.vehicle.vehicleType)})`
                      : "Sem veículo"
                  }
                />
                <DriverInfoItem
                  icon={<Send className="h-5 w-5" />}
                  label="Viagens realizadas"
                  value={String(driver.completedTrips)}
                />
                <DriverInfoItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Admissão"
                  value={driver.createdAt}
                />
              </div>

              <div className="mx-6 rounded-2xl border border-[#E5EAF0] bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      CNH do motorista
                    </p>
                    <p className="text-xs text-slate-500">
                      Documento para avaliação administrativa.
                    </p>
                  </div>
                  <span
                    className={`rounded-lg px-2 py-1 text-xs font-semibold ${formatDocumentStatus(cnh?.validationStatus).className}`}
                  >
                    {formatDocumentStatus(cnh?.validationStatus).label}
                  </span>
                </div>
                {cnh ? (
                  <div className="grid gap-3">
                    <DocumentPreview
                      src={cnh.url}
                      name={cnh.originalFilename}
                    />
                    <div className="flex flex-wrap gap-2">
                      {(["ANALYSIS", "APPROVED", "REJECTED"] as const).map(
                        (status) => (
                          <Button
                            key={status}
                            type="button"
                            size="sm"
                            className={`h-10 rounded-xl border px-4 text-sm font-semibold transition-colors ${documentEvaluationButtonStyles[status][cnh.validationStatus === status ? "active" : "inactive"]}`}
                            variant="outline"
                            onClick={async () => {
                              const updatedDocument =
                                await evaluateDriverDocument(cnh.id, status);
                              setCnh(updatedDocument);
                              onDocumentChanged?.(
                                updatedDocument.validationStatus,
                              );
                            }}
                          >
                            {status === "ANALYSIS"
                              ? "Em análise"
                              : status === "APPROVED"
                                ? "Aceitar"
                                : "Rejeitar"}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Nenhuma CNH cadastrada.
                  </p>
                )}
              </div>

              <UserFeedbackPanel userId={driver.id} />

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
