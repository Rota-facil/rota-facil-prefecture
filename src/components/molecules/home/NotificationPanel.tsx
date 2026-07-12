"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NotificationCard from "@/components/atom/NotificationCard";
import { UseNotifications } from "@/hooks/UseNotifications";
import { NotificationMap } from "@/types/enums/NotificationType";

export default function NotificationPanel() {
  const { notificationsPage, loading } = UseNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const notifications = notificationsPage?.content ?? [];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative ml-auto">
      <button
        type="button"
        aria-label="Abrir notificações"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border transition-colors ${
          open
            ? "border-blue-200 bg-blue-50 text-[#1E3A8A]"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }`}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell className="h-4.5 w-4.5" />
        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {open && (
        <section
          role="dialog"
          aria-label="Notificações"
          className="absolute right-0 top-12 z-[100] w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.45)]"
        >
          <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#1E3A8A]" />
                <h2 className="font-bold text-slate-950">Notificações</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {notifications.length} notificação(ões) recente(s)
              </p>
            </div>
            <button
              type="button"
              aria-label="Fechar notificações"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="max-h-[min(32rem,calc(100vh-7rem))] overflow-y-auto p-4 [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300">
            {loading && notificationsPage === null ? (
              <div className="grid gap-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
                <Bell className="h-7 w-7 text-slate-300" />
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  Nenhuma notificação recente
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Novos avisos aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    statusBar={
                      NotificationMap[notification.notificationType]?.value ??
                      "delayReported"
                    }
                    description={notification.message}
                    time={formatDistanceToNow(
                      new Date(notification.createdAt),
                      {
                        addSuffix: true,
                        locale: ptBR,
                      },
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
