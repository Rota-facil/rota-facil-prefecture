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

export function hasValidCoordinates(latitude: number, longitude: number) {
  return latitude !== 0 || longitude !== 0;
}

export function buildOpenStreetMapHtml(trip: TripEntity) {
  const shouldShowBus = hasValidCoordinates(trip.latitude, trip.longitude);
  const busMarker = shouldShowBus
    ? [
        {
          type: "bus",
          label: "Ônibus",
          name: trip.bus.plate,
          latitude: trip.latitude,
          longitude: trip.longitude,
        },
      ]
    : [];
  const boardPointMarkers = trip.route.boardPoints.map((point) => ({
    type: "boarding",
    label: "Ponto de embarque",
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
  const markers = [...busMarker, ...boardPointMarkers, ...institutionMarkers];
  const firstMarker = markers[0] ?? { latitude: -14.235, longitude: -51.9253 };

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; }
    body { background: #EEF2F7; }
    .marker-shell { width: 44px; height: 44px; border-radius: 999px; display: grid; place-items: center; border: 4px solid #fff; box-shadow: 0 0 0 5px var(--glow), 0 14px 30px rgba(15,23,42,.34); }
    .marker-shell svg { width: 24px; height: 24px; stroke: #fff; stroke-width: 2.35; fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .bus-marker { --glow: rgba(30,58,138,.24); background: #1E3A8A; }
    .boarding-marker { --glow: rgba(5,150,105,.24); background: #059669; }
    .institution-marker { --glow: rgba(245,158,11,.28); background: #F59E0B; border-radius: 14px; }
    .leaflet-popup-content { font-family: Arial, sans-serif; font-size: 12px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const markers = ${JSON.stringify(markers)};
    const map = L.map('map', { zoomControl: true }).setView([${firstMarker.latitude}, ${firstMarker.longitude}], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const iconHtml = {
      bus: '<div class="marker-shell bus-marker"><svg viewBox="0 0 24 24"><path d="M6 17h12"/><path d="M6 17v2"/><path d="M18 17v2"/><path d="M5 6c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v10H5V6Z"/><path d="M7 8h10"/><path d="M8 13h.01"/><path d="M16 13h.01"/></svg></div>',
      boarding: '<div class="marker-shell boarding-marker"><svg viewBox="0 0 24 24"><path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg></div>',
      institution: '<div class="marker-shell institution-marker"><svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/><path d="M9 10h.01"/><path d="M15 10h.01"/></svg></div>'
    };

    const icons = {
      bus: L.divIcon({ className: '', html: iconHtml.bus, iconSize: [52, 52], iconAnchor: [26, 26] }),
      boarding: L.divIcon({ className: '', html: iconHtml.boarding, iconSize: [52, 52], iconAnchor: [26, 26] }),
      institution: L.divIcon({ className: '', html: iconHtml.institution, iconSize: [52, 52], iconAnchor: [26, 26] })
    };

    const bounds = [];
    markers.forEach((marker) => {
      const position = [marker.latitude, marker.longitude];
      bounds.push(position);
      L.marker(position, { icon: icons[marker.type] })
        .addTo(map)
        .bindPopup('<strong>' + marker.label + '</strong><br />' + marker.name);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
    }

    setTimeout(() => map.invalidateSize(), 150);
  </script>
</body>
</html>`;
}

function formatStatusTime(date: Date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "Horário indisponível";
  }

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

function LegendIcon({
  type,
  icon,
}: {
  type: "bus" | "boarding" | "institution";
  icon: React.ReactNode;
}) {
  const classNames = {
    bus: "bg-[#1E3A8A] shadow-[0_0_0_4px_rgba(30,58,138,0.16)]",
    boarding: "bg-emerald-600 shadow-[0_0_0_4px_rgba(5,150,105,0.16)]",
    institution:
      "rounded-lg bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.18)]",
  };

  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white text-white ${classNames[type]}`}
    >
      {icon}
    </span>
  );
}

export function MapLegend({ showBus }: { showBus: boolean }) {
  return (
    <div className="flex flex-wrap gap-3 border-t border-[#E5EAF0] bg-white px-4 py-3 text-xs font-medium text-slate-600">
      <div className="flex items-center gap-2">
        <LegendIcon type="bus" icon={<Bus className="h-4 w-4" />} />
        <span>{showBus ? "Ônibus" : "Ônibus sem localização"}</span>
      </div>
      <div className="flex items-center gap-2">
        <LegendIcon type="boarding" icon={<MapPin className="h-4 w-4" />} />
        <span>Ponto de embarque</span>
      </div>
      <div className="flex items-center gap-2">
        <LegendIcon
          type="institution"
          icon={<Building2 className="h-4 w-4" />}
        />
        <span>Instituição</span>
      </div>
    </div>
  );
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
  const showBusOnMap = hasValidCoordinates(trip.latitude, trip.longitude);

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
              <MapLegend showBus={showBusOnMap} />
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
                      {showBusOnMap
                        ? `${trip.latitude.toFixed(5)}, ${trip.longitude.toFixed(5)}`
                        : "Aguardando localização"}
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
