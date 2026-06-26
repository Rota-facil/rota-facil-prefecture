import { type LucideIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AnalysisCardProps {
  title: string;
  description: string;
  buttonText: string;
  icon: LucideIcon;
  badgeText?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "danger";
}

const variants = {
  primary: {
    iconBg: "bg-gradient-to-br from-blue-700 to-blue-500",
    badge: "bg-blue-100 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
  },

  danger: {
    iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
    badge: "bg-red-100 text-red-600",
    button: "bg-white border border-red-300 text-red-500 hover:bg-red-50",
  },
};

const sizes = {
  sm: {
    container: "max-w-[520px] min-h-[170px] p-6",
    iconWrapper: "h-16 w-16",
    icon: "h-8 w-8",
    title: "text-2xl",
    description: "text-sm",
  },

  md: {
    container: "max-w-[560px] min-h-[190px] p-7",
    iconWrapper: "h-18 w-18",
    icon: "h-9 w-9",
    title: "text-3xl",
    description: "text-base",
  },

  lg: {
    container: "max-w-[620px] min-h-[220px] p-8",
    iconWrapper: "h-20 w-20",
    icon: "h-10 w-10",
    title: "text-4xl",
    description: "text-lg",
  },
};

export default function AnalysisCard({
  title,
  description,
  buttonText,
  icon: Icon,
  badgeText = "IA",
  size = "sm",
  variant = "primary",
}: AnalysisCardProps) {
  const s = sizes[size];
  const v = variants[variant];

  return (
    <div
      className={`w-full rounded-[28px] border border-slate-200 bg-white shadow-sm ${s.container}`}
    >
      <div className="flex gap-5">
        <div
          className={`flex shrink-0 items-center justify-center rounded-full shadow-md ${s.iconWrapper} ${v.iconBg}`}
        >
          <Icon className={`${s.icon} text-white`} />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={`${s.title} font-bold text-slate-900`}>{title}</h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${v.badge}`}
            >
              {badgeText}
            </span>
          </div>

          <p className={`mt-2 text-slate-500 ${s.description}`}>
            {description}
          </p>

          <Button
            className={`mt-5 w-fit rounded-full px-6 cursor-pointer ${v.button}`}
          >
            <Sparkles className="mr-2 h-6 w-6" />
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
