"use client";

import { ArrowLeft, Check, FileText, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ApplicationStatusBadge from "@/components/organims/prefecture-applications/ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import {
  evaluatePrefectureApplication,
  getPrefectureApplication,
  getPrefectureApplicationDocuments,
} from "@/service/PrefectureApplicationService";
import type {
  ApplicationStatus,
  PrefectureApplicationDetails,
} from "@/types/PrefectureApplication";

const evaluationStatuses: Array<{
  value: ApplicationStatus;
  label: string;
}> = [
  { value: "ANALYSIS", label: "Em análise" },
  { value: "APPROVED", label: "Aprovada" },
  { value: "REJECTED", label: "Rejeitada" },
];

export default function PrefectureApplicationDetailsPage({
  applicationId,
}: {
  applicationId: string;
}) {
  const { user, loading: userLoading } = useCurrentUser();
  const [application, setApplication] =
    useState<PrefectureApplicationDetails>();
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const [evaluationStatus, setEvaluationStatus] =
    useState<ApplicationStatus>("ANALYSIS");
  async function load() {
    setLoading(true);
    try {
      const [details, documentsResult] = await Promise.allSettled([
        getPrefectureApplication(applicationId),
        getPrefectureApplicationDocuments(applicationId),
      ]);

      if (details.status === "rejected") {
        throw details.reason;
      }

      setApplication({
        ...details.value,
        documents:
          documentsResult.status === "fulfilled"
            ? documentsResult.value
            : undefined,
      });
    } catch {
      /* O serviço já apresenta a mensagem da API. */
    } finally {
      setLoading(false);
    }
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: load is scoped to this application route.
  useEffect(() => {
    if (!userLoading && user?.role === "SUPERUSER") load();
    else if (!userLoading) setLoading(false);
  }, [applicationId, userLoading, user?.role]);
  if (userLoading || loading)
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-blue-700" />
      </div>
    );
  if (user?.role !== "SUPERUSER")
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-3 text-center">
        <ShieldAlert className="h-10 w-10 text-red-400" />
        <h1 className="text-xl font-black">Acesso restrito</h1>
        <p className="text-sm text-slate-500">
          Somente usuários SUPERUSER podem analisar solicitações.
        </p>
      </div>
    );
  if (!application)
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Não foi possível carregar a solicitação.
      </div>
    );
  async function runEvaluation() {
    try {
      const updated = await evaluatePrefectureApplication(
        applicationId,
        evaluationStatus,
        evaluationStatus === "REJECTED" ? rejectReason : undefined,
      );
      setApplication((current) =>
        current ? { ...updated, documents: current.documents } : updated,
      );
      setEvaluationOpen(false);
      setRejectReason("");
      toast.success("Avaliação atualizada com sucesso.");
    } catch {
      /* O erro é tratado pelo serviço HTTP. */
    }
  }
  return (
    <div className="-m-5 min-h-[calc(100vh-4rem)] bg-slate-50 px-6 py-7">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/prefecture-applications"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Solicitações de adesão
        </Link>
        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-3xl font-black tracking-tight text-slate-950">
              {application.name}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Cadastro em {application.createdAt}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ApplicationStatusBadge status={application.status} />
            <Button
              className="rounded-xl bg-blue-700 text-white hover:bg-blue-800"
              onClick={() => {
                setEvaluationStatus(application.status);
                setRejectReason(application.rejectionReason ?? "");
                setEvaluationOpen(true);
              }}
            >
              <Check className="h-4 w-4" />
              {application.status === "ANALYSIS"
                ? "Avaliar solicitação"
                : "Alterar avaliação"}
            </Button>
          </div>
        </div>
        <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="grid gap-5">
            <Section title="Informações institucionais">
              <Info label="Prefeitura" value={application.name} />
              <Info
                label="Município"
                value={`${application.municipality} - ${application.state}`}
              />
              <Info label="CNPJ" value={application.cnpj ?? "—"} />
              <Info label="Código IBGE" value={application.ibgeCode ?? "—"} />
              <Info
                label="E-mail institucional"
                value={application.institutionalEmail}
              />
              <Info label="Telefone" value={application.institutionalPhone} />
            </Section>
            <Section title="Responsável">
              <Info label="Nome" value={application.responsibleName} />
              <Info label="Cargo" value={application.responsibleRole ?? "—"} />
              <Info label="E-mail" value={application.responsibleEmail} />
              <Info label="Telefone" value={application.responsiblePhone} />
            </Section>
            <Section title="Documentação">
              <div className="grid gap-2">
                {!application.documents?.length ? (
                  <p className="text-sm text-slate-500">
                    Nenhum documento disponível.
                  </p>
                ) : (
                  application.documents.map((document) => (
                    <a
                      key={document.id}
                      href={document.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      <FileText className="h-5 w-5" />
                      {document.originalFilename}
                    </a>
                  ))
                )}
              </div>
            </Section>
          </div>
          <div className="grid content-start gap-5">
            <Section title="Resultado da avaliação">
              <div className="grid gap-3">
                <ApplicationStatusBadge status={application.status} />
                {application.rejectionReason ? (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                      Motivo da rejeição
                    </p>
                    <p className="mt-2 text-sm leading-6 text-red-950">
                      {application.rejectionReason}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-slate-500">
                    Nenhum motivo de rejeição foi registrado.
                  </p>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
      {evaluationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-black">Atualizar avaliação</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Escolha o status atual da solicitação. Você pode alterar essa
              decisão posteriormente.
            </p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {evaluationStatuses.map((status) => (
                <button
                  type="button"
                  key={status.value}
                  onClick={() => setEvaluationStatus(status.value)}
                  className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${evaluationStatus === status.value ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50"}`}
                >
                  {status.label}
                </button>
              ))}
            </div>
            {evaluationStatus === "REJECTED" ? (
              <Textarea
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                className="mt-5 min-h-28 rounded-xl"
                placeholder="Justificativa obrigatória"
              />
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setEvaluationOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="rounded-xl bg-blue-700 text-white hover:bg-blue-800"
                disabled={
                  evaluationStatus === "REJECTED" && !rejectReason.trim()
                }
                onClick={runEvaluation}
              >
                Salvar avaliação
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-black text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 py-2.5 first:pt-0 last:border-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}
