"use client";

import { MessageSquareText, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { listReceivedFeedbacks } from "@/service/FeedbackService";
import type { ReceivedFeedbackEntity } from "@/types/entites/ReceivedFeedbackEntity";

interface UserFeedbackPanelProps {
  userId: string;
}

function formatFeedbackDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data indisponível";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function UserFeedbackPanel({ userId }: UserFeedbackPanelProps) {
  const [feedbacks, setFeedbacks] = useState<ReceivedFeedbackEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadFeedbacks() {
      try {
        const result = await listReceivedFeedbacks(userId);
        if (active) setFeedbacks(result);
      } catch {
        if (active) setFeedbacks([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadFeedbacks();
    return () => {
      active = false;
    };
  }, [userId]);

  return (
    <section className="border-t border-slate-200 bg-white px-6 py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-[#1E3A8A]" />
            <h3 className="text-sm font-bold text-slate-950">
              Feedbacks recebidos
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Comentários e notas registrados após as viagens.
          </p>
        </div>
        {!loading && (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#1E3A8A]">
            {feedbacks.length}
          </span>
        )}
      </div>

      <div className="mt-4 max-h-72 overflow-y-auto pr-1 [scrollbar-color:#CBD5E1_transparent] [scrollbar-width:thin]">
        {loading ? (
          <div className="grid gap-3">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
            <MessageSquareText className="h-6 w-6 text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-600">
              Nenhum feedback recebido
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {feedbacks.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {item.senderName || item.senderEmail}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {item.senderEmail} • {formatFeedbackDate(item.createdAt)}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    {item.note.toFixed(1)}
                  </span>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {item.feedback}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
