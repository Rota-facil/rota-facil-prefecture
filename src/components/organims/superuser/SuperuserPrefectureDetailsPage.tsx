"use client";

import {
  ArrowLeft,
  BusFront,
  GraduationCap,
  Landmark,
  Loader2,
  MapPinned,
  Route,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PrefectureOverview } from "@/service/PrefectureApplicationService";
import { getPrefectureOverview } from "@/service/PrefectureApplicationService";

export default function SuperuserPrefectureDetailsPage({
  prefectureId,
}: {
  prefectureId: string;
}) {
  const [prefecture, setPrefecture] = useState<PrefectureOverview>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getPrefectureOverview(prefectureId)
      .then((data) => {
        if (active) setPrefecture(data);
      })
      .catch((caught) => {
        if (active) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Não foi possível carregar os dados desta prefeitura.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [prefectureId]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
      </div>
    );
  }

  if (error || !prefecture) {
    return (
      <div className="-m-5 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Landmark className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-xl font-black text-slate-950">
          Não foi possível carregar a prefeitura
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {error || "Não encontramos os dados desta prefeitura."}
        </p>
        <Link
          href="/superuser/prefectures"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para prefeituras
        </Link>
      </div>
    );
  }

  const metrics = [
    {
      label: "Usuários ativos",
      value: prefecture.activeUsers,
      icon: <UsersRound className="h-5 w-5" />,
      tone: "blue",
    },
    {
      label: "Alunos",
      value: prefecture.activeStudents,
      icon: <GraduationCap className="h-5 w-5" />,
      tone: "violet",
    },
    {
      label: "Motoristas",
      value: prefecture.activeDrivers,
      icon: <UsersRound className="h-5 w-5" />,
      tone: "cyan",
    },
    {
      label: "Veículos",
      value: prefecture.activeVehicles,
      icon: <BusFront className="h-5 w-5" />,
      tone: "amber",
    },
    {
      label: "Rotas ativas",
      value: prefecture.activeRoutes,
      icon: <Route className="h-5 w-5" />,
      tone: "emerald",
    },
    {
      label: "Viagens",
      value: prefecture.activeTrips,
      icon: <MapPinned className="h-5 w-5" />,
      tone: "orange",
    },
  ];

  return (
    <div className="-m-5 min-h-[calc(100vh-4rem)] bg-[#f5f8fc] px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/superuser/prefectures"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Prefeituras conectadas
        </Link>

        <div className="relative mt-5 overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-blue-950/10 sm:px-9">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-emerald-300">
                Prefeitura conectada
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                {prefecture.name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                <MapPinned className="h-4 w-4 text-cyan-300" />
                Região {prefecture.region}
              </p>
            </div>
            <p className="font-mono text-xs text-slate-400">{prefecture.id}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SummaryPanel
            title="Estrutura operacional"
            items={[
              ["Instituições", prefecture.activeInstitutions],
              ["Pontos de embarque", prefecture.activeBoardPoints],
              ["Rotas ativas", prefecture.activeRoutes],
            ]}
          />
          <SummaryPanel
            title="Pessoas e recursos"
            items={[
              ["Usuários ativos", prefecture.activeUsers],
              ["Alunos cadastrados", prefecture.activeStudents],
              ["Motoristas cadastrados", prefecture.activeDrivers],
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: string;
}) {
  const toneClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    cyan: "bg-cyan-50 text-cyan-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[tone]}`}
      >
        {icon}
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

function SummaryPanel({
  title,
  items,
}: {
  title: string;
  items: Array<[string, number]>;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <div className="mt-4 divide-y divide-slate-100">
        {items.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-black text-slate-900">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
