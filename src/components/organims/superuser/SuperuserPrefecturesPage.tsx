"use client";

import {
  Building2,
  Loader2,
  MapPinned,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteManagedPrefecture,
  listManagedPrefectures,
  type ManagedPrefecture,
} from "@/service/PrefectureApplicationService";

export default function SuperuserPrefecturesPage() {
  const [prefectures, setPrefectures] = useState<ManagedPrefecture[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string>();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPrefectures(await listManagedPrefectures());
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível carregar as prefeituras.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(prefecture: ManagedPrefecture) {
    const confirmed = window.confirm(
      `Deseja realmente remover ${prefecture.name} da rede de prefeituras conectadas?`,
    );
    if (!confirmed) return;

    setDeletingId(prefecture.id);
    try {
      await deleteManagedPrefecture(prefecture.id);
      setPrefectures((current) =>
        current.filter((item) => item.id !== prefecture.id),
      );
      toast.success("Prefeitura removida da rede.");
    } catch {
      /* O erro é tratado pelo serviço HTTP. */
    } finally {
      setDeletingId(undefined);
    }
  }

  const filteredPrefectures = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return prefectures;
    return prefectures.filter((prefecture) =>
      `${prefecture.name} ${prefecture.region}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [prefectures, search]);

  return (
    <div className="-m-5 min-h-[calc(100vh-4rem)] bg-[#f5f8fc] px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-blue-700">
              Ecossistema Rota Fácil
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Prefeituras conectadas
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Uma visão institucional dos municípios que já fazem parte da rede.
            </p>
          </div>
          <Button
            onClick={() => void load()}
            variant="outline"
            className="rounded-xl"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total conectado"
            value={prefectures.length}
            icon={<Building2 className="h-5 w-5" />}
          />
          <SummaryCard
            label="Regiões representadas"
            value={new Set(prefectures.map((item) => item.region)).size}
            icon={<MapPinned className="h-5 w-5" />}
          />
          <SummaryCard
            label="Visão atual"
            value="Ativa"
            icon={<Search className="h-5 w-5" />}
          />
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-black text-slate-950">Rede de municípios</h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredPrefectures.length} prefeitura(s) encontrada(s)
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar prefeitura ou região"
                className="h-10 rounded-xl pl-9"
              />
            </div>
          </div>
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-blue-700" />
            </div>
          ) : error ? (
            <div className="p-10 text-center text-sm text-red-700">{error}</div>
          ) : filteredPrefectures.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Nenhuma prefeitura encontrada.
            </div>
          ) : (
            <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPrefectures.map((prefecture) => (
                <div
                  key={prefecture.id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5"
                >
                  <Link
                    href={`/superuser/prefectures/${prefecture.id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Conectada
                      </span>
                    </div>
                    <h3 className="mt-5 truncate font-black text-slate-900">
                      {prefecture.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Região {prefecture.region}
                    </p>
                    <p className="mt-4 truncate font-mono text-[11px] text-slate-400">
                      {prefecture.id}
                    </p>
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={deletingId === prefecture.id}
                    onClick={() => void handleDelete(prefecture)}
                    className="mt-5 w-full rounded-xl border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  >
                    {deletingId === prefecture.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Remover prefeitura
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        {icon}
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}
