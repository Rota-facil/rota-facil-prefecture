"use client";

import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { listAudits } from "@/service/AuditService";
import {
  listManagedPrefectures,
  listPrefectureApplications,
} from "@/service/PrefectureApplicationService";
import type { AuditEntity } from "@/types/entites/AuditEntity";
import type { PrefectureApplicationSummary } from "@/types/PrefectureApplication";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function SuperuserDashboard() {
  const [applications, setApplications] = useState<
    PrefectureApplicationSummary[]
  >([]);
  const [prefectureCount, setPrefectureCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");
  const [prefecturesError, setPrefecturesError] = useState("");
  const [audits, setAudits] = useState<AuditEntity[]>([]);
  const [auditError, setAuditError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setApplicationsError("");
    setPrefecturesError("");
    setAuditError("");
    const [applicationsResult, prefecturesResult, auditsResult] =
      await Promise.allSettled([
        listPrefectureApplications({ size: 100 }),
        listManagedPrefectures(),
        listAudits(),
      ]);

    if (applicationsResult.status === "fulfilled") {
      setApplications(applicationsResult.value.content);
    } else {
      setApplicationsError(
        "Não foi possível carregar as solicitações de adesão.",
      );
    }
    if (prefecturesResult.status === "fulfilled") {
      setPrefectureCount(prefecturesResult.value.length);
    } else {
      setPrefecturesError(
        "Não foi possível carregar as prefeituras conectadas.",
      );
    }
    if (auditsResult.status === "fulfilled") {
      setAudits(auditsResult.value);
    } else {
      setAuditError("A atividade de auditoria não pôde ser carregada agora.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const analysisCount = applications.filter(
    (application) => application.status === "ANALYSIS",
  ).length;
  const approvedCount = applications.filter(
    (application) => application.status === "APPROVED",
  ).length;
  const recentApplications = [...applications]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const recentAudits = audits.slice(0, 5);
  return (
    <div className="-m-5 min-h-[calc(100vh-4rem)] bg-[#f5f8fc] px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-blue-950/10 sm:px-9">
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                Central de gestão Rota Fácil
              </div>
              <h1 className="mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                Uma visão clara de tudo que está acontecendo na plataforma.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Acompanhe municípios, candidaturas e sinais importantes da
                operação com a perspectiva interna do Rota Fácil.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<Building2 className="h-5 w-5" />}
            label="Prefeituras conectadas"
            value={prefectureCount}
            detail="Municípios na plataforma"
            tone="blue"
            loading={loading}
            error={prefecturesError}
          />
          <MetricCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Em análise"
            value={analysisCount}
            detail="Solicitações aguardando decisão"
            tone="amber"
            loading={loading}
            error={applicationsError}
          />
          <MetricCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Eventos auditados"
            value={audits.length}
            detail="Registros de atividade disponíveis"
            tone="violet"
            loading={loading}
            error={auditError}
          />
          <MetricCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Aprovadas"
            value={approvedCount}
            detail="Candidaturas aprovadas"
            tone="emerald"
            loading={loading}
            error={applicationsError}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-blue-700">
                  Atenção necessária
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-950">
                  Solicitações recentes
                </h2>
              </div>
              <Link
                href="/prefecture-applications"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                Ver todas <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {applicationsError ? (
              <EmptyState message={applicationsError} />
            ) : loading ? (
              <LoadingState />
            ) : recentApplications.length === 0 ? (
              <EmptyState message="Nenhuma solicitação encontrada" />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentApplications.map((application) => (
                  <Link
                    key={application.id}
                    href={`/prefecture-applications/${application.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {application.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {application.municipality} ·{" "}
                        {formatDate(application.createdAt)}
                      </p>
                    </div>
                    <StatusPill status={application.status} />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[.18em] text-violet-700">
                  Controle e transparência
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-950">
                  Atividade recente
                </h2>
              </div>
              <Link
                href="/audit"
                className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900"
              >
                Ver auditoria <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {auditError ? (
              <EmptyState message={auditError} />
            ) : loading ? (
              <LoadingState />
            ) : recentAudits.length === 0 ? (
              <EmptyState message="Nenhuma atividade registrada" />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentAudits.map((audit) => (
                  <div
                    key={audit.id}
                    className="flex items-start gap-3 px-6 py-4"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {audit.actionTitle}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {audit.email} · {audit.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone,
  loading,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
  tone: "blue" | "amber" | "emerald" | "violet";
  loading: boolean;
  error?: string;
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    violet: "bg-violet-50 text-violet-700",
  };
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          {icon}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Agora
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
        {loading ? "—" : value}
      </p>
      <p
        className={`mt-2 text-xs ${error ? "text-red-600" : "text-slate-400"}`}
      >
        {error || detail}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    ANALYSIS: { label: "Em análise", className: "bg-amber-50 text-amber-700" },
    APPROVED: {
      label: "Aprovada",
      className: "bg-emerald-50 text-emerald-700",
    },
    REJECTED: { label: "Rejeitada", className: "bg-red-50 text-red-700" },
  };
  const item = config[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-56 items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-blue-700" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center text-slate-400">
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
