"use client";

import { MessageSquareText, X } from "lucide-react";
import UserFeedbackPanel from "@/components/molecules/feedbacks/UserFeedbackPanel";

interface UserFeedbackModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export default function UserFeedbackModal({
  userId,
  userName,
  onClose,
}: UserFeedbackModalProps) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Feedbacks de ${userName}`}
    >
      <button
        type="button"
        aria-label="Fechar feedbacks"
        className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[86vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)]">
        <header className="relative bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] px-6 py-5 text-white">
          <button
            type="button"
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-white/80 hover:bg-white/15"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3 pr-10">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
              <MessageSquareText className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold">Feedbacks de {userName}</h2>
              <p className="mt-1 text-sm text-white/75">
                Notas e comentários recebidos nas viagens.
              </p>
            </div>
          </div>
        </header>
        <div className="max-h-[calc(86vh-96px)] overflow-y-auto">
          <UserFeedbackPanel userId={userId} />
        </div>
      </div>
    </div>
  );
}
