"use client";

import { useEffect, useState } from "react";

interface PhotoPreviewProps {
  src: string;
  alt: string;
  className?: string;
}

export default function PhotoPreview({
  src,
  alt,
  className,
}: PhotoPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className="block h-full w-full cursor-zoom-in"
        aria-label={`Ampliar ${alt}`}
        onClick={() => setIsOpen(true)}
      >
        <img src={src} alt={alt} className={className} />
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setIsOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
        >
          <button
            type="button"
            className="cursor-default"
            aria-label="Imagem ampliada"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />
          </button>
        </div>
      )}
    </>
  );
}
