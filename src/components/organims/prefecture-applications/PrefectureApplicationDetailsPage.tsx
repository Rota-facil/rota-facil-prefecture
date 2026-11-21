"use client";

import {
  ArrowLeft,
  Check,
  FileText,
  Loader2,
  MessageSquarePlus,
  ShieldAlert,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ApplicationStatusBadge from "@/components/organims/prefecture-applications/ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import {
  addApplicationNote,
  approvePrefectureApplication,
  getPrefectureApplication,
  rejectPrefectureApplication,
  requestApplicationInformation,
} from "@/service/PrefectureApplicationService";
import type {
  ApplicationStatus,
  PrefectureApplicationDetails,
} from "@/types/PrefectureApplication";

const statusLabels: Record<ApplicationStatus, string> = {
  ANALYSIS: "Em análise",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};

export default function PrefectureApplicationDetailsPage({
  applicationId,
}: {
  applicationId: string;
}) {
  const { user, loading: userLoading } = useCurrentUser();
  const [application, setApplication] =
    useState<PrefectureApplicationDetails>();
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [action, setAction] = useState<
    "approve" | "reject" | "info" | undefined
  >();
  async function load() {
    setLoading(true);
    try {
      setApplication(await getPrefectureApplication(applicationId));
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
  async function runAction() {
    if (!action) return;
    try {
      const updated =
        action === "approve"
          ? await approvePrefectureApplication(applicationId)
          : action === "reject"
            ? await rejectPrefectureApplication(applicationId, rejectReason)
            : await requestApplicationInformation(applicationId, message);
      setApplication(updated);
      setAction(undefined);
      setRejectReason("");
      setMessage("");
      toast.success("Solicitação atualizada com sucesso.");
    } catch {
      /* O erro é tratado pelo serviço HTTP. */
    }
  }
  async function saveNote() {
    if (!note.trim()) return;
    try {
      setApplication(await addApplicationNote(applicationId, note.trim()));
      setNote("");
      toast.success("Observação registrada.");
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
            {application.status === "ANALYSIS" && (
              <>
                <Button
                  className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => setAction("approve")}
                >
                  <Check className="h-4 w-4" />
                  Aprovar
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => setAction("reject")}
                >
                  <X className="h-4 w-4" />
                  Rejeitar
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setAction("info")}
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  Solicitar informações
                </Button>
              </>
            )}
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
            <Section title="Histórico">
              <div className="grid gap-5">
                {(application.history ?? []).map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {statusLabels[event.status]}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {event.description}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {event.createdAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Observações internas">
              <div className="grid gap-3">
                {(application.internalNotes ?? []).map((item) => (
                  <div key={item.id} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-bold text-slate-700">
                      {item.authorName}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {item.content}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {item.createdAt}
                    </p>
                  </div>
                ))}
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Registrar uma observação administrativa..."
                  className="min-h-24 rounded-xl"
                />
                <Button
                  className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                  disabled={!note.trim()}
                  onClick={saveNote}
                >
                  Adicionar observação
                </Button>
              </div>
            </Section>
          </div>
        </div>
      </div>
      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-black">
              {action === "approve"
                ? "Aprovar solicitação?"
                : action === "reject"
                  ? "Rejeitar solicitação"
                  : "Solicitar informações"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {action === "approve"
                ? "A aprovação iniciará o processo de cadastro e provisionamento do acesso administrativo."
                : action === "reject"
                  ? "Informe a justificativa que será registrada na solicitação."
                  : "Descreva os dados ou documentos que precisam ser complementados."}
            </p>
            {action === "reject" ? (
              <Textarea
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                className="mt-5 min-h-28 rounded-xl"
                placeholder="Justificativa obrigatória"
              />
            ) : action === "info" ? (
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="mt-5 min-h-28 rounded-xl"
                placeholder="Quais informações são necessárias?"
              />
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setAction(undefined)}
              >
                Cancelar
              </Button>
              <Button
                className={`rounded-xl text-white ${action === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-700 hover:bg-blue-800"}`}
                disabled={
                  (action === "reject" && !rejectReason.trim()) ||
                  (action === "info" && !message.trim())
                }
                onClick={runAction}
              >
                {action === "approve"
                  ? "Confirmar aprovação"
                  : action === "reject"
                    ? "Confirmar rejeição"
                    : "Enviar solicitação"}
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
