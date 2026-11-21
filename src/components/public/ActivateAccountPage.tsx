"use client";

import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  activateInvitation,
  validateInvitation,
} from "@/service/PrefectureApplicationService";

export default function ActivateAccountPage() {
  const [token, setToken] = useState("");
  const [info, setInfo] = useState<{ prefectureName: string; email: string }>();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const validate = useCallback(async (value: string) => {
    setError("");
    setLoading(true);
    try {
      setInfo(await validateInvitation(value));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Convite inválido ou expirado.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const value =
      new URLSearchParams(window.location.search).get("token") ?? "";
    setToken(value);
    if (value) validate(value);
  }, [validate]);
  async function activate() {
    setError("");
    setLoading(true);
    try {
      await activateInvitation(token, password);
      setDone(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível ativar a conta.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fbff] px-5 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Rota Fácil
        </Link>
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-blue-950/5 sm:p-9">
          {done ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
              <h1 className="mt-5 text-2xl font-black">Conta ativada</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sua conta está pronta. Acesse a plataforma para começar.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white"
              >
                Ir para o login
              </Link>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h1 className="mt-5 text-2xl font-black">Ative seu acesso</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use o convite recebido por e-mail para configurar o acesso
                administrativo.
              </p>
              {info ? (
                <div className="mt-6 grid gap-4">
                  <div className="rounded-xl bg-slate-50 p-4 text-sm">
                    <p className="font-bold text-slate-800">
                      {info.prefectureName}
                    </p>
                    <p className="mt-1 text-slate-500">{info.email}</p>
                  </div>
                  <label
                    htmlFor="activation-password"
                    className="grid gap-2 text-xs font-bold text-slate-600"
                  >
                    Nova senha
                    <Input
                      id="activation-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </label>
                  <Button
                    className="h-11 rounded-xl bg-blue-700 text-white hover:bg-blue-800"
                    disabled={password.length < 8 || loading}
                    onClick={activate}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Confirmar ativação"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="mt-6 grid gap-3">
                  <label
                    htmlFor="activation-token"
                    className="grid gap-2 text-xs font-bold text-slate-600"
                  >
                    Token do convite
                    <Input
                      id="activation-token"
                      value={token}
                      onChange={(event) => setToken(event.target.value)}
                      className="h-11 rounded-xl"
                    />
                  </label>
                  <Button
                    className="h-11 rounded-xl bg-blue-700 text-white hover:bg-blue-800"
                    disabled={!token || loading}
                    onClick={() => validate(token)}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Validar convite"
                    )}
                  </Button>
                </div>
              )}
              {error && (
                <div className="mt-5 flex gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                  <CircleAlert className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
