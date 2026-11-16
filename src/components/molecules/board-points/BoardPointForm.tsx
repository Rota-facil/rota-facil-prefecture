"use client";

import { ImagePlus } from "lucide-react";
import { type FormEvent, useState } from "react";
import FormField from "@/components/atom/FormField";
import PhotoPreview from "@/components/atom/PhotoPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BoardPointEntity } from "@/types/entites/BoardPointEntity";
import type { CreateBoardPointRequest } from "@/types/request/BoardPointRequest";

interface BoardPointFormProps {
  initialBoardPoint?: BoardPointEntity;
  photoUrl?: string;
  onSubmit: (request: CreateBoardPointRequest, photo?: File) => void;
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
  photoUrl,
  onSubmit,
  onCancel,
}: BoardPointFormProps) {
  const [form, setForm] = useState<BoardPointFormState>(
    mapBoardPointToForm(initialBoardPoint),
  );
  const [selectedPhoto, setSelectedPhoto] = useState<File>();
  const [photoPreview, setPhotoPreview] = useState<string>();

  function updateField(field: keyof BoardPointFormState, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit(
      {
        name: form.name.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      },
      selectedPhoto,
    );
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

      <div className="grid gap-2">
        <p className="text-sm font-semibold text-slate-950">Foto do ponto</p>
        {photoPreview || photoUrl ? (
          <PhotoPreview
            src={photoPreview ?? photoUrl ?? ""}
            alt="Foto do ponto de embarque"
            className="h-32 w-full rounded-xl object-cover"
          />
        ) : null}
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#CBD5E1] bg-slate-50 px-4 py-3 text-sm text-slate-600 hover:bg-slate-100">
          <ImagePlus className="h-4 w-4 text-[#1E3A8A]" />
          <span>{selectedPhoto?.name ?? "Selecionar foto do ponto"}</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setSelectedPhoto(file);
              setPhotoPreview(file ? URL.createObjectURL(file) : undefined);
            }}
          />
        </label>
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
