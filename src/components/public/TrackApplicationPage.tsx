"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileText,
  Loader2,
  Mail,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PUBLIC_ACCESS_TOKEN_STORAGE_KEY } from "@/components/public/PublicShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPrefectureApplicationDocuments,
  getPublicApplication,
} from "@/service/PrefectureApplicationService";
import type {
  ApplicationDocument,
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
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async (accessToken: string) => {
    const normalizedToken = accessToken.trim();
    if (!normalizedToken) return;

    setError("");
    setApplication(undefined);
    setDocuments([]);
    setDocumentsError("");
    setDocumentsLoading(true);
    setLoading(true);
    try {
      const result = await getPublicApplication(normalizedToken);
      window.localStorage.setItem(
        PUBLIC_ACCESS_TOKEN_STORAGE_KEY,
        normalizedToken,
      );
      setToken(normalizedToken);
      setApplication(result);
      try {
        setDocuments(await getPrefectureApplicationDocuments(result.id));
      } catch {
        setDocumentsError(
          "Não foi possível carregar os documentos desta solicitação.",
        );
      } finally {
        setDocumentsLoading(false);
      }
    } catch (caught) {
      setDocumentsLoading(false);
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
                    {isAnalysis && (
                      <a
                        href={`mailto:suporte@rotafacil.com?subject=${encodeURIComponent(`Dúvida sobre candidatura ${application.id}`)}&body=${encodeURIComponent(`Olá, gostaria de falar sobre a candidatura da prefeitura ${application.name}, do município de ${application.municipality} - ${application.state}.\n\nID da candidatura: ${application.id}`)}`}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-xs font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
                      >
                        <Mail className="h-4 w-4" />
                        Falar com o Rota Fácil por e-mail
                      </a>
                    )}
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

                <section className="rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        Documentos enviados
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Arquivos anexados ao cadastro da prefeitura.
                      </p>
                    </div>
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  {documentsLoading ? (
                    <div className="flex items-center gap-2 px-5 py-5 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
                      Carregando documentos...
                    </div>
                  ) : documentsError ? (
                    <p className="px-5 py-5 text-sm text-amber-700">
                      {documentsError}
                    </p>
                  ) : documents.length === 0 ? (
                    <p className="px-5 py-5 text-sm text-slate-500">
                      Nenhum documento encontrado para esta solicitação.
                    </p>
                  ) : (
                    <div className="grid gap-2 p-4">
                      {documents.map((document) => (
                        <a
                          key={document.id}
                          href={document.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50/60"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                              <FileText className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-bold text-slate-800">
                                {document.originalFilename}
                              </span>
                              <span className="mt-0.5 block text-xs text-slate-400">
                                {formatDate(document.createdAt)}
                              </span>
                            </span>
                          </span>
                          <span className="shrink-0 text-xs font-bold text-blue-700">
                            Visualizar
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </section>

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
