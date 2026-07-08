"use client";

import { Building2, Bus, MapPin, Route, X } from "lucide-react";
import StatusBar from "@/components/atom/statusBar";
import { Button } from "@/components/ui/button";
import type {
  TripEntity,
  TripRoutePointEntity,
} from "@/types/entites/TripEntity";
import { ProgressMap } from "@/types/enums/Progress";

interface TripProgressModalProps {
  trip: TripEntity;
  onClose: () => void;
}

function buildOpenStreetMapHtml(trip: TripEntity) {
  const busMarker = {
    type: "bus",
    label: "Ônibus",
    name: trip.bus.plate,
    latitude: trip.latitude,
    longitude: trip.longitude,
  };
  const boardPointMarkers = trip.route.boardPoints.map((point) => ({
    type: "boarding",
    label: "Ponto",
    name: point.name,
    latitude: point.latitude,
    longitude: point.longitude,
  }));
  const institutionMarkers = trip.route.institutions.map((point) => ({
    type: "institution",
    label: "Instituição",
    name: point.name,
    latitude: point.latitude,
    longitude: point.longitude,
  }));
  const markers = [busMarker, ...boardPointMarkers, ...institutionMarkers];

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; }
    .bus-marker { width: 26px; height: 26px; border-radius: 999px; background: #1E3A8A; border: 5px solid #fff; box-shadow: 0 0 0 5px rgba(30,58,138,.22), 0 10px 28px rgba(30,58,138,.45); }
    .point-marker { width: 20px; height: 20px; border-radius: 999px; background: #059669; border: 4px solid #fff; box-shadow: 0 0 0 4px rgba(5,150,105,.2), 0 8px 22px rgba(15,23,42,.35); }
    .institution-marker { width: 21px; height: 21px; border-radius: 6px; background: #F59E0B; border: 4px solid #fff; box-shadow: 0 0 0 4px rgba(245,158,11,.22), 0 8px 22px rgba(15,23,42,.35); }
    .leaflet-popup-content { font-family: Arial, sans-serif; font-size: 12px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const markers = ${JSON.stringify(markers)};
    const map = L.map('map', { zoomControl: true }).setView([${trip.latitude}, ${trip.longitude}], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const icons = {
      bus: L.divIcon({ className: '', html: '<div class="bus-marker"></div>', iconSize: [36, 36], iconAnchor: [18, 18] }),
      boarding: L.divIcon({ className: '', html: '<div class="point-marker"></div>', iconSize: [28, 28], iconAnchor: [14, 14] }),
      institution: L.divIcon({ className: '', html: '<div class="institution-marker"></div>', iconSize: [29, 29], iconAnchor: [14, 14] })
    };

    const bounds = [];
    markers.forEach((marker) => {
      const position = [marker.latitude, marker.longitude];
      bounds.push(position);
      L.marker(position, { icon: icons[marker.type] })
        .addTo(map)
        .bindPopup('<strong>' + marker.label + '</strong><br />' + marker.name);
    });

    setTimeout(() => map.invalidateSize(), 150);
  </script>
</body>
</html>`;
}

function formatStatusTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getDelayLabel(delay: string) {
  const labels: Record<string, string> = {
    LATE: "Atrasado",
    PUNCTUAL: "Pontual",
    EARLY: "Adiantado",
  };

  return labels[delay] ?? delay;
}

function getDelayClassName(delay: string) {
  if (delay === "LATE") {
    return "bg-red-50 text-[#DC2626] ring-red-200";
  }

  if (delay === "EARLY") {
    return "bg-blue-50 text-[#1E3A8A] ring-blue-200";
  }

  return "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function PointList({
  title,
  icon,
  points,
}: {
  title: string;
  icon: React.ReactNode;
  points: TripRoutePointEntity[];
}) {
  return (
    <div className="rounded-2xl border border-[#E5EAF0] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-slate-950">{title}</p>
      </div>
      <div className="grid gap-2">
        {points.map((point) => (
          <div
            key={point.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2"
          >
            <span className="truncate text-sm font-medium text-slate-700">
              {point.name}
            </span>
            <span className="shrink-0 font-mono text-[11px] text-slate-400">
              {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TripProgressModal({
  trip,
  onClose,
}: TripProgressModalProps) {
  const status = ProgressMap[trip.actualStatus];
  const ignoredInstitutions = trip.ignoredInstitutions ?? [];
  const ignoredBoardPoints = trip.ignoredBoardPoints ?? [];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-md"
        aria-label="Fechar progresso"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#E5EAF0]/80 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] px-6 py-5 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.26),transparent_34%),radial-gradient(circle_at_84%_30%,rgba(255,255,255,0.16),transparent_32%)]" />
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="absolute right-4 top-4 h-8 w-8 cursor-pointer rounded-xl text-white/80 hover:bg-white/15 hover:text-white"
            aria-label="Fechar progresso"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="relative flex flex-col gap-3 pr-10 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xl font-bold">{trip.name}</p>
              <p className="mt-1 text-sm text-white/75">
                {trip.route.name} • {trip.startedAtLabel}
              </p>
            </div>
            <StatusBar variant={status.value} size="sm" />
          </div>
        </div>

        <div className="max-h-[calc(90vh-108px)] overflow-y-auto p-6 [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-[#E5EAF0] bg-slate-100">
              <iframe
                title={`Mapa da viagem ${trip.code}`}
                srcDoc={buildOpenStreetMapHtml(trip)}
                className="h-[360px] w-full border-0"
                loading="lazy"
              />
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-[#E5EAF0] bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Bus className="h-4 w-4 text-[#1E3A8A]" />
                  <p className="text-sm font-semibold text-slate-950">
                    Operação
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-slate-600">
                  <div className="flex justify-between gap-3">
                    <span>Motorista</span>
                    <strong className="text-right text-slate-900">
                      {trip.bus.driver?.name ?? "Sem motorista"}
                    </strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Ônibus</span>
                    <strong className="font-mono text-slate-900">
                      {trip.bus.plate}
                    </strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Alunos</span>
                    <strong className="text-slate-900">
                      {trip.students}/{trip.expectedStudents}
                    </strong>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Coordenadas atuais</span>
                    <strong className="text-right font-mono text-xs text-slate-900">
                      {trip.latitude.toFixed(5)}, {trip.longitude.toFixed(5)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5EAF0] bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Route className="h-4 w-4 text-[#1E3A8A]" />
                  <p className="text-sm font-semibold text-slate-950">
                    Horários da rota
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <span>Ida</span>
                  <strong className="text-right text-slate-900">
                    {trip.route.going} - {trip.route.goingFinish}
                  </strong>
                  <span>Retorno</span>
                  <strong className="text-right text-slate-900">
                    {trip.route.return_} - {trip.route.returnFinish}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#E5EAF0] bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Route className="h-4 w-4 text-[#1E3A8A]" />
              <p className="text-sm font-semibold text-slate-950">
                Status da viagem
              </p>
            </div>
            <div className="grid max-h-64 gap-2 overflow-y-auto pr-1 [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
              {trip.tripStatus.map((statusItem) => (
                <div
                  key={statusItem.id}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {statusItem.description}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {ProgressMap[statusItem.progress].description} •{" "}
                      {formatStatusTime(statusItem.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getDelayClassName(statusItem.delay)}`}
                  >
                    {getDelayLabel(statusItem.delay)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <PointList
              title="Pontos de embarque da rota"
              icon={<MapPin className="h-4 w-4 text-[#1E3A8A]" />}
              points={trip.route.boardPoints}
            />
            <PointList
              title="Instituições da rota"
              icon={<Building2 className="h-4 w-4 text-[#1E3A8A]" />}
              points={trip.route.institutions}
            />
          </div>

          {(ignoredInstitutions.length > 0 ||
            ignoredBoardPoints.length > 0) && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Pontos ignorados nesta viagem
              </p>
              <p className="mt-1 text-sm text-amber-700">
                Preparado para consumir ignoredInstitutions e ignoredBoardPoints
                quando esses campos entrarem no DTO.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
