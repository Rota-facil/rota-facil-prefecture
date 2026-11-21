"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileCheck2,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PUBLIC_ACCESS_TOKEN_STORAGE_KEY } from "@/components/public/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPublicApplication } from "@/service/PrefectureApplicationService";
import type {
  ApplicationStatus,
  PrefectureApplicationDetails,
} from "@/types/PrefectureApplication";

const statusLabels: Record<ApplicationStatus, string> = {
  ANALYSIS: "Em análise",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};

const statusColors: Record<ApplicationStatus, string> = {
  ANALYSIS: "bg-amber-50 text-amber-700 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default function TrackApplicationPage() {
  const [token, setToken] = useState("");
  const [application, setApplication] =
    useState<PrefectureApplicationDetails>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async (accessToken: string) => {
    const normalizedToken = accessToken.trim();
    if (!normalizedToken) return;

    setError("");
    setApplication(undefined);
    setLoading(true);
    try {
      const result = await getPublicApplication(normalizedToken);
      window.localStorage.setItem(
        PUBLIC_ACCESS_TOKEN_STORAGE_KEY,
        normalizedToken,
      );
      setToken(normalizedToken);
      setApplication(result);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível consultar a solicitação.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get(
      "public_access_token",
    );
    const savedToken = window.localStorage.getItem(
      PUBLIC_ACCESS_TOKEN_STORAGE_KEY,
    );
    const initialToken = queryToken || savedToken;

    if (initialToken) {
      setToken(initialToken);
      void search(initialToken);
    }
  }, [search]);

  useEffect(() => {
    if (application?.status !== "ANALYSIS" || !token) return;

    const refreshTimer = window.setInterval(() => {
      void search(token);
    }, 30_000);

    return () => window.clearInterval(refreshTimer);
  }, [application?.status, search, token]);

  const isAnalysis = application?.status === "ANALYSIS";
  const isApproved = application?.status === "APPROVED";

  return (
    <div className="min-h-screen bg-[#f8fbff] px-5 py-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Rota Fácil
        </Link>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-blue-950/5">
          <div className="relative overflow-hidden bg-slate-950 px-6 py-9 text-white sm:px-10">
            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
                Acompanhamento público
              </p>
              <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
                Acompanhe a análise da sua prefeitura
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Use o token de acesso público recebido ao finalizar o cadastro.
                Ele permite consultar o andamento sem precisar criar uma conta.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Cole seu token de acesso público"
                className="h-12 rounded-xl border-slate-200 bg-slate-50 font-mono text-xs"
                aria-label="Token de acesso público"
              />
              <Button
                className="h-12 rounded-xl bg-blue-700 px-5 text-white hover:bg-blue-800"
                disabled={!token.trim() || loading}
                onClick={() => void search(token)}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Consultar
              </Button>
            </div>

            {error && (
              <div className="mt-5 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700">
                <CircleAlert className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {application && (
              <div className="mt-8 grid gap-6 border-t border-slate-100 pt-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Solicitação recebida
                    </p>
                    <p className="mt-1 text-xl font-black text-slate-950">
                      {application.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {application.municipality} — {application.state}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${statusColors[application.status]}`}
                  >
                    {statusLabels[application.status]}
                  </span>
                </div>

                <div className="grid gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
                    {isAnalysis ? (
                      <Clock3 className="h-7 w-7" />
                    ) : isApproved ? (
                      <CheckCircle2 className="h-7 w-7" />
                    ) : (
                      <XCircle className="h-7 w-7" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-950">
                      {isAnalysis
                        ? "Sua solicitação está em análise"
                        : isApproved
                          ? "Sua solicitação foi aprovada"
                          : "Sua solicitação não foi aprovada"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {isAnalysis
                        ? "Nossa equipe está conferindo as informações e os documentos enviados. Você pode voltar a esta página quando quiser para consultar uma atualização."
                        : isApproved
                          ? "A equipe do Rota Fácil concluiu a análise da candidatura."
                          : application.rejectionReason ||
                            "A equipe concluiu a análise e registrou a decisão para esta candidatura."}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <ProgressStep
                    active
                    icon={<FileCheck2 className="h-4 w-4" />}
                    label="Cadastro recebido"
                  />
                  <ProgressStep
                    active={application.status !== "REJECTED"}
                    current={isAnalysis}
                    icon={<Search className="h-4 w-4" />}
                    label="Em análise"
                  />
                  <ProgressStep
                    active={isApproved}
                    icon={<Check className="h-4 w-4" />}
                    label="Decisão"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    label="Data do cadastro"
                    value={formatDate(application.createdAt)}
                  />
                  <InfoCard
                    label="Última atualização"
                    value={formatDate(application.updatedAt)}
                  />
                </div>

                <p className="text-xs leading-5 text-slate-400">
                  Guarde este token para consultar a solicitação novamente. O
                  Rota Fácil também o mantém salvo neste navegador para
                  facilitar seu próximo acesso.
                </p>
              </div>
            )}

            {!application && !loading && !error && (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <Clock3 className="mx-auto h-9 w-9 text-blue-300" />
                <p className="mt-3 font-bold text-slate-800">
                  Sua área de acompanhamento está pronta
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Informe o token para visualizar o status da análise.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressStep({
  active,
  current = false,
  icon,
  label,
}: {
  active: boolean;
  current?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-4 ${active ? "border-blue-100 bg-blue-50/60" : "border-slate-100 bg-slate-50"}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-400"} ${current ? "animate-pulse" : ""}`}
      >
        {icon}
      </div>
      <span
        className={`text-sm font-bold ${active ? "text-slate-800" : "text-slate-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
