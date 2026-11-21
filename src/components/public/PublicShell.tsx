"use client";

import { Menu, Route, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const PUBLIC_ACCESS_TOKEN_STORAGE_KEY = "rota-facil:public-access-token";

function TrackApplicationLink({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const token = window.localStorage.getItem(PUBLIC_ACCESS_TOKEN_STORAGE_KEY);
    if (!token) return;

    event.preventDefault();
    router.push(`/join/track?public_access_token=${encodeURIComponent(token)}`);
  }

  return (
    <Link href="/join/track" onClick={handleClick}>
      {children}
    </Link>
  );
}

export function ApplicationEntryLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const token = window.localStorage.getItem(PUBLIC_ACCESS_TOKEN_STORAGE_KEY);
    if (!token) return;

    event.preventDefault();
    router.push(`/join/track?public_access_token=${encodeURIComponent(token)}`);
  }

  return (
    <Link href="/join" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3.5">
          <Image
            src="/icon-rota-facil-2.png"
            alt="Rota Fácil"
            width={68}
            height={68}
            className="h-16 w-16 shrink-0"
          />
          <span className="text-xl font-extrabold tracking-tight text-slate-950">
            Rota Fácil
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-blue-700">
            Funcionalidades
          </a>
          <a href="#prefectures" className="transition hover:text-blue-700">
            Prefeituras
          </a>
          <a href="#students" className="transition hover:text-blue-700">
            Estudantes
          </a>
          <a href="#how-it-works" className="transition hover:text-blue-700">
            Como funciona
          </a>
          <a href="#security" className="transition hover:text-blue-700">
            Segurança
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
          >
            Entrar
          </Link>
          <Link
            href="/join"
            className="rounded-xl bg-gradient-to-r from-blue-800 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5"
          >
            Solicitar adesão
          </Link>
          <Menu
            className="ml-1 h-5 w-5 text-slate-500 md:hidden"
            aria-label="Menu"
          />
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3 text-white">
            <Image
              src="/icon-rota-facil-2.png"
              alt="Rota Fácil"
              width={38}
              height={38}
            />
            <span className="font-extrabold">Rota Fácil</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Tecnologia para tornar a gestão do transporte escolar mais segura,
            eficiente e transparente.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Navegação</p>
          <div className="mt-4 grid gap-3 text-sm">
            <a href="#features" className="hover:text-white">
              Funcionalidades
            </a>
            <a href="#prefectures" className="hover:text-white">
              Para prefeituras
            </a>
            <a href="#students" className="hover:text-white">
              Para estudantes
            </a>
            <a href="#how-it-works" className="hover:text-white">
              Como funciona
            </a>
            <Link href="/join" className="hover:text-white">
              Solicitar adesão
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Acesso</p>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/login" className="hover:text-white">
              Entrar na plataforma
            </Link>
            <TrackApplicationLink>
              <span className="hover:text-white">Acompanhar solicitação</span>
            </TrackApplicationLink>
            <Link href="/privacy" className="hover:text-white">
              Política de privacidade
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-5 text-xs text-slate-500 lg:px-8">
          © {new Date().getFullYear()} Rota Fácil. Gestão pública com mais
          clareza.
        </div>
      </div>
    </footer>
  );
}

export function PlatformPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-8 rounded-[3rem] bg-blue-500/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white p-3 shadow-2xl shadow-blue-950/20">
        <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-cyan-300" />
            <span className="text-xs font-bold">Visão operacional</span>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Sistema conectado
          </span>
        </div>
        <div className="grid gap-3 p-3 sm:grid-cols-[1.2fr_.8fr]">
          <div className="relative min-h-64 overflow-hidden rounded-2xl bg-[#dcecf7] p-4">
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(30deg, transparent 48%, #b8d3e6 49%, #b8d3e6 51%, transparent 52%), linear-gradient(120deg, transparent 48%, #b8d3e6 49%, #b8d3e6 51%, transparent 52%)",
                backgroundSize: "42px 42px",
              }}
            />
            <div className="relative z-10 rounded-xl bg-white/90 p-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                Em operação
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                Rota Centro · manhã
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Acompanhamento em tempo real
              </p>
            </div>
            <div className="absolute left-[38%] top-[56%] h-16 w-28 rotate-12 rounded-full border-2 border-dashed border-blue-600/60" />
            <div className="absolute left-[56%] top-[48%] h-4 w-4 rounded-full border-4 border-white bg-blue-700 shadow-lg" />
            <div className="absolute left-[28%] top-[66%] h-4 w-4 rounded-full border-4 border-white bg-emerald-500 shadow-lg" />
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Indicadores
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">—</p>
                  <p className="text-[10px] text-slate-500">viagens hoje</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">—</p>
                  <p className="text-[10px] text-slate-500">alunos ativos</p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between rounded-2xl bg-gradient-to-br from-blue-800 to-blue-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <ShieldCheck className="h-5 w-5 text-cyan-200" />
                <span className="text-[10px] font-semibold text-blue-100">
                  Gestão segura
                </span>
              </div>
              <p className="mt-6 text-sm font-semibold leading-5">
                Decisões melhores com uma operação mais organizada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
