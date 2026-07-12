"use client";

import { BarChart3, FileDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ReportCard from "@/components/molecules/reports/ReportCard";
import { getGrafanaUrl } from "@/config/env";
import { downloadReport, type ReportType } from "@/service/ReportService";

function toInputDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function ReportPage() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const [startDate, setStartDate] = useState(toInputDate(firstDay));
  const [endDate, setEndDate] = useState(toInputDate(today));
  const [loadingReport, setLoadingReport] = useState<ReportType>();

  async function handleDownload(type: ReportType) {
    if (!startDate || !endDate) {
      toast.error("Informe as datas inicial e final.");
      return;
    }

    if (startDate > endDate) {
      toast.error("A data inicial não pode ser posterior à data final.");
      return;
    }

    try {
      setLoadingReport(type);
      await downloadReport(type, startDate, endDate);
      toast.success("Relatório gerado com sucesso.");
    } catch {
      // O serviço HTTP já apresenta a mensagem retornada pelo backend.
    } finally {
      setLoadingReport(undefined);
    }
  }

  return (
    <main className="-m-5 min-h-[calc(100vh-4rem)] bg-slate-50 px-6 py-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-[#1E3A8A]">
              <FileDown className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Central de relatórios
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Gere documentos operacionais em PDF usando os dados da sua
                prefeitura.
              </p>
            </div>
          </div>
        </div>

        <a
          href={getGrafanaUrl()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <BarChart3 className="h-4 w-4" />
          Abrir observabilidade
        </a>
      </header>

      <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <p className="font-bold text-slate-900">Período dos relatórios</p>
          <p className="mt-1 text-sm text-slate-500">
            O período selecionado será aplicado ao PDF escolhido.
          </p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:max-w-xl">
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Data inicial
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Data final
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
      </section>

      <section className="mt-7 grid gap-5 xl:grid-cols-2">
        <ReportCard
          variant="dailyPresence"
          loading={loadingReport === "student-absences"}
          onExport={() => handleDownload("student-absences")}
        />
        <ReportCard
          variant="cancelledTrips"
          loading={loadingReport === "cancelled-trips"}
          onExport={() => handleDownload("cancelled-trips")}
        />
      </section>
    </main>
  );
}
