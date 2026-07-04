"use client";

import { Building2, MapPin, Pencil, Route, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import FormField from "@/components/atom/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { InstitutionEntity } from "@/types/entites/InstitutionEntity";

interface InstitutionDetailsModalProps {
  institution: InstitutionEntity;
  mode?: "details" | "create";
  onClose: () => void;
  onSave: (institution: InstitutionEntity) => void;
}

interface InstitutionFormState {
  name: string;
  latitude: string;
  longitude: string;
}

function mapInstitutionToForm(
  institution: InstitutionEntity,
): InstitutionFormState {
  return {
    name: institution.name,
    latitude: String(institution.latitude),
    longitude: String(institution.longitude),
  };
}

export default function InstitutionDetailsModal({
  institution,
  mode = "details",
  onClose,
  onSave,
}: InstitutionDetailsModalProps) {
  const isCreating = mode === "create";
  const [isEditing, setIsEditing] = useState(isCreating);
  const [form, setForm] = useState<InstitutionFormState>(
    mapInstitutionToForm(institution),
  );

  useEffect(() => {
    setIsEditing(isCreating);
    setForm(mapInstitutionToForm(institution));
  }, [institution, isCreating]);

  function updateField(field: keyof InstitutionFormState, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSave({
      ...institution,
      name: form.name.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    });
    setIsEditing(false);
  }

  function cancelEdit() {
    if (isCreating) {
      onClose();
      return;
    }

    setForm(mapInstitutionToForm(institution));
    setIsEditing(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold">
                {isCreating ? "Nova instituição" : institution.name}
              </p>
              <p className="mt-1 text-sm text-white/75">
                {isCreating
                  ? "Informe nome e coordenadas da instituição."
                  : "Instituição replicada para o domínio operacional de transporte."}
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(88vh-116px)] overflow-y-auto p-6 [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="grid gap-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Dados da instituição
                </p>
                <p className="text-xs text-slate-500">
                  Nome e coordenadas usadas na operação.
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
                <FormField label="Nome da instituição">
                  <Input
                    required
                    value={form.name}
                    className="h-9 rounded-xl border-[#E5EAF0] bg-white px-3 text-sm"
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                  />
                </FormField>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Latitude">
                    <Input
                      required
                      type="number"
                      step="any"
                      min={-90}
                      max={90}
                      value={form.latitude}
                      className="h-9 rounded-xl border-[#E5EAF0] bg-white px-3 font-mono text-sm"
                      onChange={(event) =>
                        updateField("latitude", event.target.value)
                      }
                    />
                  </FormField>

                  <FormField label="Longitude">
                    <Input
                      required
                      type="number"
                      step="any"
                      min={-180}
                      max={180}
                      value={form.longitude}
                      className="h-9 rounded-xl border-[#E5EAF0] bg-white px-3 font-mono text-sm"
                      onChange={(event) =>
                        updateField("longitude", event.target.value)
                      }
                    />
                  </FormField>
                </div>

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
                    {isCreating ? "Cadastrar instituição" : "Salvar alterações"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E5EAF0] bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Rotas associadas
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {institution.routeCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E5EAF0] bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Latitude
                  </p>
                  <p className="mt-2 font-mono text-sm font-semibold text-slate-800">
                    {institution.latitude.toFixed(6)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E5EAF0] bg-slate-50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Longitude
                  </p>
                  <p className="mt-2 font-mono text-sm font-semibold text-slate-800">
                    {institution.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            )}

            {!isCreating && (
              <div className="rounded-2xl border border-[#E5EAF0] bg-white p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#1E3A8A]" />
                  <p className="text-sm font-semibold text-slate-950">
                    Coordenadas operacionais
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  O transporte usa latitude e longitude para compor o ponto
                  geográfico da instituição e associar rotas no domínio
                  operacional.
                </p>
              </div>
            )}

            {!isCreating && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Route className="h-4 w-4 text-[#1E3A8A]" />
                  <p className="text-sm font-semibold text-slate-950">
                    Rotas vinculadas
                  </p>
                </div>
                <div className="grid gap-2">
                  {institution.routes.map((route) => (
                    <div
                      key={route.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5EAF0] bg-slate-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {route.name}
                        </p>
                        <p className="font-mono text-[11px] text-slate-400">
                          {route.code}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-[#E5EAF0]">
                        {route.shift}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
