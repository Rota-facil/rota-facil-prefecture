"use client";

import {
  Bus,
  Check,
  ChevronDown,
  IdCard,
  Pencil,
  Users,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import FormField from "@/components/atom/FormField";
import StatusBar from "@/components/atom/statusBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BusEntity, BusOperationStatus } from "@/types/entites/BusEntity";
import type { UserEntity } from "@/types/entites/UserEntity";

interface BusDetailsModalProps {
  bus: BusEntity;
  mode?: "details" | "create" | "edit";
  onClose: () => void;
  onSave: (bus: BusEntity) => void;
  availableDrivers: UserEntity[];
}

interface BusFormState {
  plate: string;
  capacity: string;
  driverId: string;
  status: BusOperationStatus;
}

const statusMap = {
  operating: "busOperating",
  outOfOperation: "busOutOfOperation",
} as const;

function mapBusToForm(bus: BusEntity): BusFormState {
  return {
    plate: bus.plate,
    capacity: String(bus.capacity),
    driverId: bus.driver.id,
    status: bus.status ?? "outOfOperation",
  };
}

export default function BusDetailsModal({
  bus,
  mode = "details",
  onClose,
  onSave,
  availableDrivers,
}: BusDetailsModalProps) {
  const isCreating = mode === "create";
  const startsEditing = mode === "create" || mode === "edit";
  const [isEditing, setIsEditing] = useState(startsEditing);
  const [form, setForm] = useState<BusFormState>(mapBusToForm(bus));
  const [isDriverSelectOpen, setIsDriverSelectOpen] = useState(false);
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);
  const driverSelectRef = useRef<HTMLDivElement>(null);
  const statusSelectRef = useRef<HTMLDivElement>(null);

  const selectedDriver =
    availableDrivers.find((driver) => driver.id === form.driverId) ??
    availableDrivers[0];
  const statusOptions = [
    { value: "operating", label: "Em operação" },
    { value: "outOfOperation", label: "Fora de operação" },
  ] satisfies { value: BusOperationStatus; label: string }[];
  const selectedStatus = statusOptions.find(
    (option) => option.value === form.status,
  );

  useEffect(() => {
    setIsEditing(startsEditing);
    setForm(mapBusToForm(bus));
  }, [bus, startsEditing]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        driverSelectRef.current &&
        !driverSelectRef.current.contains(event.target as Node)
      ) {
        setIsDriverSelectOpen(false);
      }

      if (
        statusSelectRef.current &&
        !statusSelectRef.current.contains(event.target as Node)
      ) {
        setIsStatusSelectOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function updateField(field: keyof BusFormState, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave({
      ...bus,
      plate: form.plate.trim().toUpperCase(),
      capacity: Number(form.capacity),
      status: form.status,
      driver: selectedDriver,
    });
    setIsEditing(false);
  }

  function cancelEdit() {
    if (isCreating) {
      onClose();
      return;
    }

    setForm(mapBusToForm(bus));
    setIsDriverSelectOpen(false);
    setIsStatusSelectOpen(false);
    setIsEditing(false);
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-md"
        aria-label="Fechar detalhes"
        onClick={onClose}
      />
      <div className="relative max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E5EAF0]/80 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] px-6 py-5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.26),transparent_34%),radial-gradient(circle_at_84%_30%,rgba(255,255,255,0.16),transparent_32%)]" />
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="absolute right-4 top-4 h-8 w-8 cursor-pointer rounded-xl text-white/80 hover:bg-white/15 hover:text-white"
            aria-label="Fechar detalhes"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="relative flex items-start gap-4 pr-10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <Bus className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-lg font-bold tracking-wider">
                {isCreating ? "Novo ônibus" : bus.plate}
              </p>
              <p className="mt-1 text-sm text-white/75">
                {isCreating
                  ? "Informe placa, capacidade, motorista e status do ônibus."
                  : "Veículo cadastrado para a operação de transporte municipal."}
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(88vh-116px)] overflow-y-auto p-6 [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="grid gap-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Dados do ônibus
                </p>
                <p className="text-xs text-slate-500">
                  Placa, capacidade, motorista e situação operacional.
                </p>
              </div>
              {!isEditing && !isCreating && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
              )}
            </div>

            {isEditing ? (
              <form className="grid gap-4" onSubmit={submitForm}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Placa">
                    <Input
                      required
                      value={form.plate}
                      className="h-9 rounded-xl border-[#E5EAF0] bg-white px-3 font-mono text-sm uppercase"
                      onChange={(event) =>
                        updateField("plate", event.target.value)
                      }
                    />
                  </FormField>

                  <FormField label="Capacidade">
                    <Input
                      required
                      type="number"
                      min={1}
                      value={form.capacity}
                      className="h-9 rounded-xl border-[#E5EAF0] bg-white px-3 text-sm"
                      onChange={(event) =>
                        updateField("capacity", event.target.value)
                      }
                    />
                  </FormField>
                </div>

                <FormField label="Motorista">
                  <div className="relative" ref={driverSelectRef}>
                    <button
                      type="button"
                      className={`flex h-9 w-full items-center justify-between rounded-xl border bg-slate-50 px-3 text-left text-sm font-semibold text-slate-800 outline-none transition-all ${
                        isDriverSelectOpen
                          ? "border-[#3B82F6] ring-2 ring-blue-100"
                          : "border-[#E5EAF0] hover:bg-white"
                      }`}
                      onClick={() => setIsDriverSelectOpen((isOpen) => !isOpen)}
                    >
                      <span className="truncate">
                        {selectedDriver?.name ?? "Selecione um motorista"}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                          isDriverSelectOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDriverSelectOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-60 overflow-auto rounded-2xl border border-slate-100 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                        {availableDrivers.map((driver) => {
                          const isSelected = driver.id === form.driverId;

                          return (
                            <button
                              key={driver.id}
                              type="button"
                              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                                isSelected
                                  ? "bg-[#1E3A8A] text-white"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                              onClick={() => {
                                updateField("driverId", driver.id);
                                setIsDriverSelectOpen(false);
                              }}
                            >
                              <span className="min-w-0">
                                <span className="block truncate">
                                  {driver.name}
                                </span>
                                <span
                                  className={`block truncate text-[11px] ${
                                    isSelected
                                      ? "text-white/70"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {driver.email}
                                </span>
                              </span>
                              {isSelected && <Check className="h-4 w-4" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </FormField>

                <FormField label="Status operacional">
                  <div className="relative" ref={statusSelectRef}>
                    <button
                      type="button"
                      className={`flex h-9 w-full items-center justify-between rounded-xl border bg-slate-50 px-3 text-left text-sm font-semibold text-slate-800 outline-none transition-all ${
                        isStatusSelectOpen
                          ? "border-[#3B82F6] ring-2 ring-blue-100"
                          : "border-[#E5EAF0] hover:bg-white"
                      }`}
                      onClick={() => setIsStatusSelectOpen((isOpen) => !isOpen)}
                    >
                      <span>
                        {selectedStatus?.label ?? "Selecione o status"}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                          isStatusSelectOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isStatusSelectOpen && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-2xl border border-slate-100 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                        {statusOptions.map((option) => {
                          const isSelected = option.value === form.status;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                                isSelected
                                  ? "bg-[#1E3A8A] text-white"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                              onClick={() => {
                                updateField("status", option.value);
                                setIsStatusSelectOpen(false);
                              }}
                            >
                              <span>{option.label}</span>
                              {isSelected && <Check className="h-4 w-4" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </FormField>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    size="xs"
                    className="h-9 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 text-xs font-semibold text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
                  >
                    {isCreating ? "Cadastrar ônibus" : "Salvar alterações"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E5EAF0] bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Placa
                  </p>
                  <p className="mt-2 font-mono text-sm font-bold tracking-wider text-slate-950">
                    {bus.plate}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E5EAF0] bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Capacidade
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {bus.capacity}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E5EAF0] bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>
                  <div className="mt-2">
                    <StatusBar
                      variant={statusMap[bus.status ?? "outOfOperation"]}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {!isCreating && !isEditing && (
              <div className="grid gap-3 rounded-2xl border border-[#E5EAF0] bg-white p-4">
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-[#1E3A8A]" />
                  <p className="text-sm font-semibold text-slate-950">
                    Motorista vinculado
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {bus.driver.name}
                </p>
                <p className="text-xs text-slate-500">{bus.driver.email}</p>
              </div>
            )}

            {!isCreating && !isEditing && (
              <div className="rounded-2xl border border-[#E5EAF0] bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#1E3A8A]" />
                  <p className="text-sm font-semibold text-slate-950">
                    Lotação do veículo
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Capacidade registrada para planejamento de viagens e
                  associação com rotas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
