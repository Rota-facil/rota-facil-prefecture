interface DriverInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function DriverInfoItem({
  icon,
  label,
  value,
}: DriverInfoItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <span className="text-sm font-semibold text-slate-800">{value}</span>
      </div>
    </div>
  );
}
