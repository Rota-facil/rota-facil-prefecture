"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileUp,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createPrefectureApplication,
  uploadApplicationDocument,
} from "@/service/PrefectureApplicationService";
import type { PrefectureApplicationForm } from "@/types/PrefectureApplication";

const initialForm: PrefectureApplicationForm = {
  prefectureName: "",
  municipality: "",
  state: "",
  ibgeCode: "",
  cnpj: "",
  institutionalEmail: "",
  institutionalPhone: "",
  responsibleName: "",
  responsibleRole: "",
  responsibleEmail: "",
  responsiblePhone: "",
  privacyAccepted: false,
};
const steps = ["Prefeitura", "Responsável", "Documentação", "Revisão"];
const inputClass = "h-11 rounded-xl border-slate-200 bg-white px-3 text-sm";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}
function maskCnpj(value: string) {
  const d = onlyDigits(value).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}
function maskPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  return d.length > 10
    ? d.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    : d.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
}

export default function JoinApplicationPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [protocol, setProtocol] = useState<string>();

  const update = (
    field: keyof PrefectureApplicationForm,
    value: string | boolean,
  ) => setForm((current) => ({ ...current, [field]: value }));
  const canContinue = useMemo(() => {
    if (step === 0)
      return (
        form.prefectureName &&
        form.municipality &&
        form.state &&
        form.cnpj &&
        form.institutionalEmail &&
        form.institutionalPhone
      );
    if (step === 1)
      return (
        form.responsibleName &&
        form.responsibleRole &&
        form.responsibleEmail &&
        form.responsiblePhone
      );
    if (step === 2) return files.length > 0;
    return form.privacyAccepted;
  }, [files.length, form, step]);

  function handleFiles(selected: FileList | null) {
    if (!selected) return;
    const accepted = Array.from(selected).filter((file) => {
      const validType = ["application/pdf", "image/jpeg", "image/png"].includes(
        file.type,
      );
      const validSize = file.size <= 10 * 1024 * 1024;
      if (!validType || !validSize)
        toast.error(`${file.name}: use PDF, JPG ou PNG de até 10 MB.`);
      return validType && validSize;
    });
    setFiles((current) => [...current, ...accepted].slice(0, 5));
  }

  async function submit() {
    setError("");
    setSubmitting(true);
    try {
      const created = await createPrefectureApplication(form);
      for (const file of files)
        await uploadApplicationDocument(created.id, file);
      setProtocol(created.protocol);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível enviar a solicitação.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (protocol)
    return (
      <div className="min-h-screen bg-[#f8fbff]">
        <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5 py-12">
          <Link
            href="/"
            className="mb-10 flex items-center gap-2 text-sm font-bold text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-blue-950/5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-2xl font-black text-slate-950">
              Solicitação enviada
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Recebemos as informações do município. Guarde o protocolo para
              acompanhar a análise.
            </p>
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Protocolo
              </p>
              <p className="mt-2 font-mono text-xl font-black text-blue-800">
                {protocol}
              </p>
            </div>
            <Link
              href={`/join/track?protocol=${encodeURIComponent(protocol)}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
            >
              Acompanhar solicitação <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fbff]">
      <div className="mx-auto max-w-5xl px-5 py-8 lg:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Rota Fácil
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <aside className="rounded-3xl bg-slate-950 p-7 text-white lg:min-h-[620px]">
            <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-300">
              Solicitação de adesão
            </p>
            <h1 className="mt-5 text-3xl font-black leading-tight">
              Leve mais clareza para a operação do seu município.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Preencha as informações para iniciar a análise da sua prefeitura.
            </p>
            <div className="mt-10 grid gap-4">
              {steps.map((label, index) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black ${index <= step ? "bg-blue-500 text-white" : "bg-white/10 text-slate-400"}`}
                  >
                    {index < step ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <span
                    className={`text-sm font-semibold ${index === step ? "text-white" : "text-slate-500"}`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </aside>
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-blue-950/5 sm:p-8">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[.2em] text-blue-700">
                Etapa {step + 1} de {steps.length}
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">
                {steps[step]}
              </h2>
            </div>
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Nome da prefeitura"
                  value={form.prefectureName}
                  onChange={(value) => update("prefectureName", value)}
                  placeholder="Prefeitura Municipal de ..."
                />
                <Field
                  label="Município"
                  value={form.municipality}
                  onChange={(value) => update("municipality", value)}
                  placeholder="Nome do município"
                />
                <Field
                  label="Estado"
                  value={form.state}
                  onChange={(value) => update("state", value)}
                  placeholder="UF"
                  maxLength={2}
                />
                <Field
                  label="Código IBGE (opcional)"
                  value={form.ibgeCode}
                  onChange={(value) => update("ibgeCode", value)}
                  placeholder="0000000"
                />
                <Field
                  label="CNPJ"
                  value={form.cnpj}
                  onChange={(value) => update("cnpj", maskCnpj(value))}
                  placeholder="00.000.000/0000-00"
                />
                <Field
                  label="Telefone institucional"
                  value={form.institutionalPhone}
                  onChange={(value) =>
                    update("institutionalPhone", maskPhone(value))
                  }
                  placeholder="(00) 00000-0000"
                />
                <Field
                  className="sm:col-span-2"
                  label="E-mail institucional"
                  type="email"
                  value={form.institutionalEmail}
                  onChange={(value) => update("institutionalEmail", value)}
                  placeholder="contato@prefeitura.gov.br"
                />
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  className="sm:col-span-2"
                  label="Nome completo"
                  value={form.responsibleName}
                  onChange={(value) => update("responsibleName", value)}
                  placeholder="Nome do responsável"
                />
                <Field
                  label="Cargo"
                  value={form.responsibleRole}
                  onChange={(value) => update("responsibleRole", value)}
                  placeholder="Secretário(a), gestor(a)..."
                />
                <Field
                  label="Telefone"
                  value={form.responsiblePhone}
                  onChange={(value) =>
                    update("responsiblePhone", maskPhone(value))
                  }
                  placeholder="(00) 00000-0000"
                />
                <Field
                  className="sm:col-span-2"
                  label="E-mail profissional"
                  type="email"
                  value={form.responsibleEmail}
                  onChange={(value) => update("responsibleEmail", value)}
                  placeholder="responsavel@prefeitura.gov.br"
                />
                <label className="sm:col-span-2 flex cursor-pointer gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.privacyAccepted}
                    onChange={(event) =>
                      update("privacyAccepted", event.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-blue-700"
                  />
                  <span>
                    Confirmo que estou autorizado(a) a representar a prefeitura
                    nesta solicitação.
                  </span>
                </label>
              </div>
            )}
            {step === 2 && (
              <div>
                <label
                  htmlFor="application-files"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 px-5 py-12 text-center transition hover:bg-blue-50"
                >
                  <UploadCloud className="h-9 w-9 text-blue-600" />
                  <span className="mt-3 text-sm font-bold text-slate-800">
                    Selecione os documentos
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    PDF, JPG ou PNG · até 10 MB por arquivo · máximo de 5
                    arquivos
                  </span>
                  <input
                    id="application-files"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={(event) => handleFiles(event.target.files)}
                  />
                </label>
                <div className="mt-5 grid gap-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <FileUp className="h-5 w-5 shrink-0 text-blue-700" />
                        <span className="truncate text-sm font-semibold text-slate-700">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((current) =>
                            current.filter(
                              (_, fileIndex) => fileIndex !== index,
                            ),
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remover ${file.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-5">
                <Review
                  title="Prefeitura"
                  values={[
                    form.prefectureName,
                    `${form.municipality} - ${form.state}`,
                    form.cnpj,
                    form.institutionalEmail,
                  ]}
                />
                <Review
                  title="Responsável"
                  values={[
                    form.responsibleName,
                    form.responsibleRole,
                    form.responsibleEmail,
                    form.responsiblePhone,
                  ]}
                />
                <Review
                  title="Documentos"
                  values={files.map((file) => file.name)}
                />
                <label className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.privacyAccepted}
                    onChange={(event) =>
                      update("privacyAccepted", event.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-blue-700"
                  />
                  <span>
                    Li e concordo com o tratamento das informações para análise
                    desta solicitação, conforme a{" "}
                    <Link
                      href="/privacy"
                      className="font-bold text-blue-700 underline"
                    >
                      política de privacidade
                    </Link>
                    .
                  </span>
                </label>
              </div>
            )}
            {error && (
              <p className="mt-5 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="mt-8 flex justify-between gap-3 border-t border-slate-100 pt-6">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                disabled={step === 0 || submitting}
                onClick={() => setStep((current) => current - 1)}
              >
                Voltar
              </Button>
              {step < 3 ? (
                <Button
                  type="button"
                  className="h-11 rounded-xl bg-blue-700 px-5 text-white hover:bg-blue-800"
                  disabled={!canContinue}
                  onClick={() => setStep((current) => current + 1)}
                >
                  Continuar <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  className="h-11 rounded-xl bg-blue-700 px-5 text-white hover:bg-blue-800"
                  disabled={!canContinue || submitting}
                  onClick={submit}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar solicitação <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  className?: string;
}) {
  const id = `application-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div className={`grid gap-2 ${className}`}>
      <label htmlFor={id} className="text-xs font-bold text-slate-600">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
function Review({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
        {title}
      </p>
      <div className="mt-3 grid gap-2 text-sm font-semibold text-slate-700">
        {values.map((value) => (
          <span key={value}>{value || "—"}</span>
        ))}
      </div>
    </div>
  );
}
