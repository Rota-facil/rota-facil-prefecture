"use client";

import { type FormEvent, useState } from "react";
import FormField from "@/components/atom/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BoardPointEntity } from "@/types/entites/BoardPointEntity";
import type { CreateBoardPointRequest } from "@/types/request/BoardPointRequest";

interface BoardPointFormProps {
  initialBoardPoint?: BoardPointEntity;
  onSubmit: (request: CreateBoardPointRequest) => void;
  onCancel: () => void;
}

interface BoardPointFormState {
  name: string;
  latitude: string;
  longitude: string;
}

function mapBoardPointToForm(
  boardPoint?: BoardPointEntity,
): BoardPointFormState {
  return {
    name: boardPoint?.name ?? "",
    latitude: boardPoint ? String(boardPoint.latitude) : "",
    longitude: boardPoint ? String(boardPoint.longitude) : "",
  };
}

export default function BoardPointForm({
  initialBoardPoint,
  onSubmit,
  onCancel,
}: BoardPointFormProps) {
  const [form, setForm] = useState<BoardPointFormState>(
    mapBoardPointToForm(initialBoardPoint),
  );

  function updateField(field: keyof BoardPointFormState, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      name: form.name.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    });
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={submitForm}>
      <FormField label="Nome do ponto">
        <Input
          required
          value={form.name}
          placeholder="Praça Central"
          className="h-9 rounded-xl border-[#E5EAF0] bg-white px-3 text-sm"
          onChange={(event) => updateField("name", event.target.value)}
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
            placeholder="-19.9187"
            className="h-9 rounded-xl border-[#E5EAF0] bg-white px-3 font-mono text-sm"
            onChange={(event) => updateField("latitude", event.target.value)}
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
            placeholder="-43.9386"
            className="h-9 rounded-xl border-[#E5EAF0] bg-white px-3 font-mono text-sm"
            onChange={(event) => updateField("longitude", event.target.value)}
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="h-9 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-xs font-semibold hover:bg-[#EEF2F7]"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="xs"
          className="h-9 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 text-xs font-semibold text-white shadow-[0_12px_30px_-18px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
        >
          {initialBoardPoint ? "Salvar alterações" : "Cadastrar ponto"}
        </Button>
      </div>
    </form>
  );
}
