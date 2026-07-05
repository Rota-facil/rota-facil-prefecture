interface PredictiveSummaryCardProps {
  label: string;
  value: number;
}

export default function PredictiveSummaryCard({
  label,
  value,
}: PredictiveSummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
