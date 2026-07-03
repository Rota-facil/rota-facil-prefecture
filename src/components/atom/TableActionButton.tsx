import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";

interface TableActionButtonProps {
  label: string;
  icon: ComponentType<{ className?: string }>;
  variant?: "default" | "destructive";
  onClick: () => void;
}

export default function TableActionButton({
  label,
  icon: Icon,
  variant = "default",
  onClick,
}: TableActionButtonProps) {
  const variantClassName =
    variant === "destructive"
      ? "text-slate-400 hover:bg-red-50 hover:text-[#DC2626]"
      : "text-slate-400 hover:bg-blue-50 hover:text-[#1E3A8A]";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      className={`h-11 w-11 cursor-pointer rounded-xl ${variantClassName}`}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
