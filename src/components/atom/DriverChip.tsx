import type { LucideIcon } from "lucide-react";

interface DriverChipProps {
  icon: LucideIcon;
  text: string;
  size?: "sm" | "md";
  className?: string;
}

const sizes = {
  sm: "h-7 px-3 text-[11px]",
  md: "h-9 px-4 text-sm",
};

export default function DriverChip({
  icon: Icon,
  text,
  size = "sm",
  className = "bg-slate-100",
}: DriverChipProps) {
  return (
    <div
      className={`
        flex
        items-center
        gap-2
        rounded-full
        ${className}
        whitespace-nowrap
        ${sizes[size]}
      `}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />

      <span>{text}</span>
    </div>
  );
}
