"use client";

import {
  ArrowRight,
  ClipboardList,
  FileSearch,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ApplicationStatusBadge from "@/components/organims/prefecture-applications/ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listPrefectureApplications } from "@/service/PrefectureApplicationService";
import type {
  ApplicationStats,
  ApplicationStatus,
  PrefectureApplicationSummary,
} from "@/types/PrefectureApplication";

const emptyStats: ApplicationStats = {
  total: 0,
  analysis: 0,
  approved: 0,
  rejected: 0,
};
const filters: Array<{ label: string; value?: ApplicationStatus }> = [
  { label: "Todas" },
  { label: "Em análise", value: "ANALYSIS" },
  { label: "Aprovadas", value: "APPROVED" },
  { label: "Rejeitadas", value: "REJECTED" },
];

export default function PrefectureApplicationsPage() {
  const [stats, setStats] = useState(emptyStats);
  const [applications, setApplications] = useState<
    PrefectureApplicationSummary[]
  >([]);
  const [status, setStatus] = useState<ApplicationStatus>();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const listResponse = await listPrefectureApplications({ status, search });
      setApplications(listResponse.content);
      setStats({
        total: listResponse.page.totalElements,
        analysis: listResponse.content.filter(
          (item) => item.status === "ANALYSIS",
        ).length,
        approved: listResponse.content.filter(
          (item) => item.status === "APPROVED",
        ).length,
        rejected: listResponse.content.filter(
          (item) => item.status === "REJECTED",
        ).length,
      });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "A API de solicitações ainda não está disponível.",
      );
    } finally {
      setLoading(false);
    }
  }
  // The manual refresh action intentionally reuses the current filter state.
  // biome-ignore lint/correctness/useExhaustiveDependencies: load reads the current filter values when invoked.
  useEffect(() => {
    load();
  }, [status]);
  return (
    <div className="-m-5 min-h-[calc(100vh-4rem)] bg-slate-50 px-6 py-7">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-3xl font-black tracking-tight text-slate-950">
              Solicitações de adesão
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Analise os pedidos de municípios interessados no Rota Fácil.
            </p>
          </div>
          <Button onClick={load} variant="outline" className="h-10 rounded-xl">
            Atualizar
          </Button>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total", stats.total, "text-slate-900"],
            ["Em análise", stats.analysis, "text-amber-700"],
            ["Aprovadas", stats.approved, "text-emerald-700"],
            ["Rejeitadas", stats.rejected, "text-red-700"],
          ].map(([label, value, color]) => (
            <div
              key={label as string}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {label as string}
              </p>
              <p className={`mt-3 text-3xl font-black ${color as string}`}>
                {loading ? "—" : (value as number)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setStatus(filter.value)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${status === filter.value ? "bg-blue-700 text-white" : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && load()}
                placeholder="Buscar prefeitura ou CNPJ"
                className="h-10 w-full rounded-xl sm:w-64"
              />
              <Button
                size="icon-lg"
                className="h-10 w-10 rounded-xl bg-blue-700 text-white"
                onClick={load}
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {error ? (
            <div className="flex min-h-52 flex-col items-center justify-center gap-3 p-8 text-center">
              <FileSearch className="h-9 w-9 text-slate-300" />
              <p className="max-w-md text-sm text-slate-500">{error}</p>
              <p className="text-xs text-slate-400">
                Tente novamente em alguns instantes.
              </p>
            </div>
          ) : loading ? (
            <div className="flex min-h-52 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-blue-700" />
            </div>
          ) : applications.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center gap-3 p-8 text-center">
              <ClipboardList className="h-9 w-9 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">
                Nenhuma solicitação encontrada
              </p>
              <p className="text-xs text-slate-400">
                As solicitações recebidas aparecerão nesta lista.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Prefeitura</th>
                    <th className="px-5 py-4">Município</th>
                    <th className="px-5 py-4">CNPJ</th>
                    <th className="px-5 py-4">Responsável</th>
                    <th className="px-5 py-4">Solicitado em</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {application.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {application.municipality} - {application.state}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-600">
                        {application.cnpj ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {application.responsibleName}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {application.createdAt}
                      </td>
                      <td className="px-5 py-4">
                        <ApplicationStatusBadge status={application.status} />
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/prefecture-applications/${application.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
                        >
                          Ver detalhes <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
