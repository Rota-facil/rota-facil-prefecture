"use client";

import {
  Camera,
  Check,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/UseCurrentUser";
import {
  getCurrentUserPhoto,
  updateCurrentUser,
  uploadCurrentUserPhoto,
} from "@/service/ProfileService";

export default function ProfilePage() {
  const { user, loading: userLoading } = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [form, setForm] = useState({ name: "", email: "", cpf: "" });
  const [saving, setSaving] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(true);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name, email: user.email, cpf: user.cpf ?? "" });
  }, [user]);

  useEffect(() => {
    let active = true;
    getCurrentUserPhoto()
      .then((url) => {
        if (active && url) setPhotoUrl(url);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoadingPhoto(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleFileChange(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem para sua foto de perfil.");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const updatedUser = await updateCurrentUser(form);
      if (selectedFile) {
        const uploadedPhotoUrl = await uploadCurrentUserPhoto(selectedFile);
        setPhotoUrl(uploadedPhotoUrl);
        setPreviewUrl(undefined);
        setSelectedFile(undefined);
      }
      setForm({
        name: updatedUser.name,
        email: updatedUser.email,
        cpf: updatedUser.cpf ?? "",
      });
      toast.success("Perfil atualizado com sucesso.");
      window.location.reload();
    } catch {
      /* O erro já é apresentado pelo serviço HTTP. */
    } finally {
      setSaving(false);
    }
  }

  if (userLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <Loader2 className="h-7 w-7 animate-spin text-blue-700" />
      </div>
    );
  }

  const displayedPhoto = previewUrl ?? photoUrl;

  return (
    <div className="-m-5 min-h-[calc(100vh-4rem)] bg-[#f5f8fc] px-6 py-7 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-blue-950/10 sm:px-9">
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-200">
              Conta e segurança
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Meu perfil
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Atualize seus dados de acesso e escolha a imagem que representa
              você no Rota Fácil.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-6 lg:grid-cols-[.75fr_1.25fr]"
        >
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div
                className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-700 to-cyan-500 text-4xl font-black text-white ring-8 ring-blue-50"
                style={
                  displayedPhoto
                    ? {
                        backgroundImage: `url(${displayedPhoto})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }
                    : undefined
                }
              >
                {!displayedPhoto &&
                  (loadingPhoto ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    user.name[0]?.toUpperCase()
                  ))}
              </div>
              <button
                type="button"
                aria-label="Escolher foto de perfil"
                onClick={() => fileInputRef.current?.click()}
                className="relative z-10 -mt-3 inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-bold text-white shadow-md transition hover:bg-slate-800"
              >
                <Camera className="h-3.5 w-3.5" />
                Alterar foto
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFileChange(event.target.files?.[0])}
              />
              <h2 className="mt-5 text-lg font-black text-slate-950">
                {user.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Gestor Rota Fácil
              </span>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-black text-slate-950">Dados pessoais</h2>
                <p className="text-xs text-slate-500">
                  Informações usadas para identificar sua conta.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-5">
              <label
                htmlFor="profile-name"
                className="grid gap-2 text-sm font-bold text-slate-700"
              >
                Nome completo
                <Input
                  id="profile-name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                  className="h-11 rounded-xl"
                />
              </label>
              <label
                htmlFor="profile-email"
                className="grid gap-2 text-sm font-bold text-slate-700"
              >
                E-mail
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="profile-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    required
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </label>
              <label
                htmlFor="profile-cpf"
                className="grid gap-2 text-sm font-bold text-slate-700"
              >
                CPF
                <Input
                  id="profile-cpf"
                  value={form.cpf}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      cpf: event.target.value,
                    }))
                  }
                  className="h-11 rounded-xl"
                />
              </label>
              <div className="flex justify-end border-t border-slate-100 pt-5">
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-11 rounded-xl bg-blue-700 px-5 text-white hover:bg-blue-800"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Salvar alterações
                </Button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
