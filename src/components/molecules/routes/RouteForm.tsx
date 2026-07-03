"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import FormField from "@/components/atom/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RouteEntity } from "@/types/entites/RouteEntity";
import type {
  CreateBoardPointRouteRequest,
  CreateRouteRequest,
  RouteDayOfWeek,
  RouteShift,
} from "@/types/request/RouteRequest";
import { dayLabels, shiftLabels } from "./RouteFilters";

interface RouteOption {
  id: string;
  label: string;
}

interface RouteFormProps {
  initialRoute?: RouteEntity;
  institutions: RouteOption[];
  bus: RouteOption[];
  boardPoints: RouteOption[];
  onSubmit: (request: CreateRouteRequest) => void;
  onCancel: () => void;
}

const weekDays = Object.keys(dayLabels) as RouteDayOfWeek[];

const defaultBoardPoint = (
  boardPointId: string,
): CreateBoardPointRouteRequest => ({
  boardPointId,
  boardTimeGoing: "06:40",
  boardTimeFinish: "12:10",
});

function mapRouteToRequest(route: RouteEntity): CreateRouteRequest {
  return {
    shift: route.shift,
    name: route.name,
    going: route.going,
    return_: route.return_,
    goingFinish: route.goingFinish,
    returnFinish: route.returnFinish,
    daysOfWeek: route.daysOfWeek,
    institutionsIds: route.institutions.map((institution) => institution.id),
    busIds: route.bus.map((busItem) => busItem.id),
    boardPoints: route.boardPoints.map((boardPoint) => ({
      boardPointId: boardPoint.boardPointId,
      boardTimeGoing: boardPoint.boardTimeGoing,
      boardTimeFinish: boardPoint.boardTimeFinish,
    })),
  };
}

function toggleValue<TValue extends string>(values: TValue[], value: TValue) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function RouteForm({
  initialRoute,
  institutions,
  bus,
  boardPoints,
  onSubmit,
  onCancel,
}: RouteFormProps) {
  const firstInstitutionId = institutions[0]?.id ?? "";
  const firstBusId = bus[0]?.id ?? "";
  const firstBoardPointId = boardPoints[0]?.id ?? "";

  const [form, setForm] = useState<CreateRouteRequest>(
    initialRoute
      ? mapRouteToRequest(initialRoute)
      : {
          shift: "MORNING",
          name: "",
          going: "06:30",
          return_: "12:00",
          goingFinish: "07:30",
          returnFinish: "13:00",
          daysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
          institutionsIds: firstInstitutionId ? [firstInstitutionId] : [],
          busIds: firstBusId ? [firstBusId] : [],
          boardPoints: firstBoardPointId
            ? [defaultBoardPoint(firstBoardPointId)]
            : [],
        },
  );

  function updateField<TField extends keyof CreateRouteRequest>(
    field: TField,
    value: CreateRouteRequest[TField],
  ) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function updateBoardPoint(
    index: number,
    field: keyof CreateBoardPointRouteRequest,
    value: string,
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      boardPoints: currentForm.boardPoints.map((boardPoint, boardPointIndex) =>
        boardPointIndex === index
          ? { ...boardPoint, [field]: value }
          : boardPoint,
      ),
    }));
  }

  function removeBoardPoint(index: number) {
    setForm((currentForm) => ({
      ...currentForm,
      boardPoints: currentForm.boardPoints.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  function addBoardPoint() {
    if (!firstBoardPointId) {
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      boardPoints: [
        ...currentForm.boardPoints,
        defaultBoardPoint(firstBoardPointId),
      ],
    }));
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={submitForm}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Nome da rota">
          <Input
            required
            value={form.name}
            placeholder="Centro -> E.M. João Paulo"
            onChange={(event) => updateField("name", event.target.value)}
          />
        </FormField>

        <FormField label="Turno">
          <select
            value={form.shift}
            onChange={(event) =>
              updateField("shift", event.target.value as RouteShift)
            }
            className="h-9 w-full cursor-pointer rounded-xl border border-[#E5EAF0] bg-white px-3 text-sm text-slate-700 outline-none transition hover:bg-[#EEF2F7] focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30"
          >
            {Object.entries(shiftLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Horário de ida">
          <Input
            required
            type="time"
            value={form.going}
            onChange={(event) => updateField("going", event.target.value)}
          />
        </FormField>

        <FormField label="Fim da ida">
          <Input
            required
            type="time"
            value={form.goingFinish}
            onChange={(event) => updateField("goingFinish", event.target.value)}
          />
        </FormField>

        <FormField label="Horário de volta">
          <Input
            required
            type="time"
            value={form.return_}
            onChange={(event) => updateField("return_", event.target.value)}
          />
        </FormField>

        <FormField label="Fim da volta">
          <Input
            required
            type="time"
            value={form.returnFinish}
            onChange={(event) =>
              updateField("returnFinish", event.target.value)
            }
          />
        </FormField>
      </div>

      <FormField label="Dias recorrentes">
        <div className="flex flex-wrap gap-2">
          {weekDays.map((day) => (
            <label
              key={day}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E5EAF0] bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-[#EEF2F7]"
            >
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={form.daysOfWeek.includes(day)}
                onChange={() =>
                  updateField("daysOfWeek", toggleValue(form.daysOfWeek, day))
                }
              />
              {dayLabels[day]}
            </label>
          ))}
        </div>
      </FormField>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Instituições">
          <div className="grid gap-2 rounded-md border border-border p-3">
            {institutions.map((institution) => (
              <label
                key={institution.id}
                className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"
              >
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={form.institutionsIds.includes(institution.id)}
                  onChange={() =>
                    updateField(
                      "institutionsIds",
                      toggleValue(form.institutionsIds, institution.id),
                    )
                  }
                />
                {institution.label}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Ônibus recorrentes">
          <div className="grid gap-2 rounded-md border border-border p-3">
            {bus.map((busItem) => (
              <label
                key={busItem.id}
                className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"
              >
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={form.busIds.includes(busItem.id)}
                  onChange={() =>
                    updateField("busIds", toggleValue(form.busIds, busItem.id))
                  }
                />
                {busItem.label}
              </label>
            ))}
          </div>
        </FormField>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Pontos de embarque
          </p>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 cursor-pointer rounded-xl border-[#E5EAF0] px-4 text-sm font-semibold hover:bg-[#EEF2F7]"
            onClick={addBoardPoint}
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar ponto
          </Button>
        </div>

        <div className="grid gap-3">
          {form.boardPoints.map((boardPoint, index) => (
            <div
              key={`${boardPoint.boardPointId}-${index}`}
              className="grid grid-cols-1 gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_120px_120px_36px]"
            >
              <select
                value={boardPoint.boardPointId}
                onChange={(event) =>
                  updateBoardPoint(index, "boardPointId", event.target.value)
                }
                className="h-10 cursor-pointer rounded-xl border border-[#E5EAF0] bg-white px-3 text-sm text-slate-700 outline-none transition hover:bg-[#EEF2F7] focus-visible:ring-2 focus-visible:ring-[#3B82F6]/30"
              >
                {boardPoints.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Input
                required
                type="time"
                value={boardPoint.boardTimeGoing}
                onChange={(event) =>
                  updateBoardPoint(index, "boardTimeGoing", event.target.value)
                }
              />

              <Input
                required
                type="time"
                value={boardPoint.boardTimeFinish}
                onChange={(event) =>
                  updateBoardPoint(index, "boardTimeFinish", event.target.value)
                }
              />

              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                className="h-11 w-11 cursor-pointer rounded-xl text-slate-400 hover:bg-red-50 hover:text-[#DC2626]"
                aria-label="Remover ponto"
                onClick={() => removeBoardPoint(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="h-11 cursor-pointer rounded-xl border-[#E5EAF0] px-5 text-sm font-semibold hover:bg-[#EEF2F7]"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          size="xs"
          className="h-11 cursor-pointer rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-5 text-sm font-semibold text-white shadow-[0_0_28px_-12px_rgba(59,130,246,0.9)] hover:from-[#183276] hover:to-[#2563EB]"
        >
          {initialRoute ? "Salvar rota" : "Criar rota"}
        </Button>
      </div>
    </form>
  );
}
