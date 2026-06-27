import { useId } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({ label, error, children }: FormFieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-wide text-slate-400"
      >
        {label}
      </label>
      <div id={id}>{children}</div>
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
