"use client";

import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface DocumentPreviewProps {
  src: string;
  name: string;
}

export default function DocumentPreview({ src, name }: DocumentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="flex h-24 w-full items-center gap-3 rounded-xl border border-[#E5EAF0] bg-slate-50 px-4 text-left hover:bg-slate-100"
        onClick={() => setIsOpen(true)}
      >
        <FileText className="h-7 w-7 text-[#1E3A8A]" />
        <span className="truncate text-sm font-semibold text-slate-700">
          {name}
        </span>
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={name}
          onClick={() => setIsOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
        >
          <iframe
            src={src}
            title={name}
            className="h-[92vh] w-[94vw] rounded-xl bg-white"
          />
        </div>
      )}
    </>
  );
}
