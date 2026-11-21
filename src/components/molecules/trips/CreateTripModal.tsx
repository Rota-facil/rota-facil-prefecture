"use client";

import { FileText, Route, Truck, X } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateTripRequest } from "@/service/TripService";
import type { RouteEntity } from "@/types/entites/RouteEntity";

interface CreateTripModalProps {
  routes: RouteEntity[];
  onClose: () => void;
  onCreate: (request: CreateTripRequest) => Promise<boolean>;
}

export default function CreateTripModal({
  routes,
  onClose,
  onCreate,
}: CreateTripModalProps) {
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedRoute = useMemo(
    () => routes.find((route) => route.id === routeId),
    [routeId, routes],
  );
  const availableVehicles = selectedRoute?.vehicles ?? [];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!routeId || !vehicleId || submitting) return;

    setSubmitting(true);
    try {
      if (
        await onCreate({ routeId, vehicleId, name: name.trim() || undefined })
      ) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar criação de viagem"
        className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] px-6 py-5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.26),transparent_34%)]" />
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Fechar"
            className="absolute right-4 top-4 h-8 w-8 cursor-pointer rounded-xl text-white/80 hover:bg-white/15 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="relative pr-10">
            <p className="text-lg font-bold">Nova viagem</p>
            <p className="mt-1 text-sm text-white/75">
              Crie uma viagem de hoje usando um veículo já associado à rota.
            </p>
          </div>
        </div>

        <form className="grid gap-5 p-6" onSubmit={submit}>
          <label
            htmlFor="trip-name"
            className="grid gap-2 text-sm font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Nome da viagem
              <span className="font-normal text-slate-400">(opcional)</span>
            </span>
            <Input
              id="trip-name"
              value={name}
              maxLength={120}
              placeholder="Ex.: Viagem Centro - manhã"
              className="h-11 rounded-xl border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            <span className="flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-600" />
              Rota
            </span>
            <select
              required
              value={routeId}
              className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              onChange={(event) => {
                setRouteId(event.target.value);
                setVehicleId("");
              }}
            >
              <option value="">Selecione uma rota</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              Veículo associado
            </span>
            <select
              required
              disabled={!selectedRoute || availableVehicles.length === 0}
              value={vehicleId}
              className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              onChange={(event) => setVehicleId(event.target.value)}
            >
              <option value="">
                {!selectedRoute
                  ? "Selecione primeiro uma rota"
                  : availableVehicles.length === 0
                    ? "Esta rota não possui veículo associado"
                    : "Selecione um veículo"}
              </option>
              {availableVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.label}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-900">
            A viagem será criada com status <strong>Aguardando</strong>. O
            veículo precisa estar ativo, possuir motorista e pertencer à rota
            selecionada.
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 cursor-pointer rounded-xl px-5"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!routeId || !vehicleId || submitting}
              className="h-10 cursor-pointer rounded-xl bg-[#1E3A8A] px-5 text-white hover:bg-[#183276] disabled:cursor-not-allowed"
            >
              {submitting ? "Criando..." : "Criar viagem"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
