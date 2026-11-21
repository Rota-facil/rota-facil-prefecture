"use client";

import { ArrowLeft, Check, CircleAlert, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPublicApplication } from "@/service/PrefectureApplicationService";
import type {
  ApplicationStatus,
  PrefectureApplicationDetails,
} from "@/types/PrefectureApplication";

const statusLabels: Record<ApplicationStatus, string> = {
  UNDER_ANALYSIS: "Em análise",
  ADDITIONAL_INFO_REQUIRED: "Informações adicionais",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};
const statusColors: Record<ApplicationStatus, string> = {
  UNDER_ANALYSIS: "bg-amber-50 text-amber-700 ring-amber-200",
  ADDITIONAL_INFO_REQUIRED: "bg-violet-50 text-violet-700 ring-violet-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
};

export default function TrackApplicationPage() {
  const [token, setToken] = useState("");
  const [application, setApplication] =
    useState<PrefectureApplicationDetails>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const queryToken = new URLSearchParams(window.location.search).get(
      "protocol",
    );
    if (queryToken) setToken(queryToken);
  }, []);
  async function search() {
    setError("");
    setApplication(undefined);
    setLoading(true);
    try {
      setApplication(await getPublicApplication(token.trim()));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível consultar a solicitação.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-[#f8fbff] px-5 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Rota Fácil
        </Link>
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[.2em] text-blue-700">
            Acompanhamento
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            Acompanhe sua solicitação
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Informe o protocolo recebido após o envio da solicitação.
          </p>
          <div className="mt-7 flex gap-2">
            <Input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Digite o protocolo"
              className="h-11 rounded-xl"
            />
            <Button
              className="h-11 rounded-xl bg-blue-700 px-4 text-white hover:bg-blue-800"
              disabled={!token.trim() || loading}
              onClick={search}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Consultar</span>
            </Button>
          </div>
          {error && (
            <div className="mt-5 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <CircleAlert className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}
          {application && (
            <div className="mt-8 grid gap-6 border-t border-slate-100 pt-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Prefeitura
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-900">
                    {application.prefectureName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Protocolo {application.protocol}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${statusColors[application.status]}`}
                >
                  {statusLabels[application.status]}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">Município</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {application.municipality} - {application.state}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400">
                    Solicitação enviada em
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {application.requestedAt}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Histórico público
                </p>
                <div className="mt-4 grid gap-5">
                  {application.history.map((event) => (
                    <div key={event.id} className="relative flex gap-3">
                      <div className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {statusLabels[event.status]}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {application.publicMessage && (
                <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-violet-900">
                  {application.publicMessage}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
