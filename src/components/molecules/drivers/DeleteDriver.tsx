"use client";

interface DeleteDriverDialogProps {
  open: boolean;
  driverName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteDriverDialog({
  open,
  driverName,
  onCancel,
  onConfirm,
}: DeleteDriverDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <div
        className="
          relative
          z-10
          w-full
          max-w-[600px]
          rounded-[24px]
          bg-white
          px-8
          py-8
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        <h2 className="text-[1.70rem] font-bold text-slate-900">
          Excluir motorista?
        </h2>

        <p className="mt-6 text-[1.1rem] leading-8 text-slate-500">
          O cadastro de{" "}
          <span className="font-semibold text-slate-700">{driverName}</span>{" "}
          será removido.
        </p>

        <div className="mt-12 flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="
              h-12
              w-[110px]
              cursor-pointer
              rounded-full
              border
              border-blue-500
              bg-white
              font-semibold
              text-slate-900
              transition-all
              duration-200

              hover:bg-orange-400
              hover:text-orange-800
              hover:text-slate-900
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              h-12
              w-[110px]
              cursor-pointer
              rounded-full
              bg-[#FF2D2D]
              font-semibold
              text-white
              shadow-md
              transition-all
              duration-200

              hover:bg-[#E52424]
              hover:shadow-lg
            "
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
