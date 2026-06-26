import { BrainCircuit, Flame, type LucideIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const typeAnalysisCard = {
  predictiveAnalytic: {
    title: "Análise preditiva de rotas",
    description: "Preveja atrasos, ocupação e riscos operacionais por rota.",
    buttonText: "Gerar análise",
    badgeText: "IA",

    icon: BrainCircuit,

    iconBg: "bg-gradient-to-br from-blue-700 to-blue-500",

    badge: "bg-blue-100 text-blue-700",

    button:
      "bg-gradient-to-r from-blue-700 to-blue-500 text-white hover:from-blue-800 hover:to-blue-600",

    background:
      "bg-[#f8fafd] bg-[linear-gradient(90deg,rgba(37,99,235,0.06)_0%,rgba(255,255,255,0)_50%,rgba(239,68,68,0.05)_100%)]",
  },

  heatMap: {
    title: "Mapa de calor de embarque",
    description: "Visualize pontos mais movimentados por rota e horário.",
    buttonText: "Gerar mapa",
    badgeText: "IA",

    icon: Flame,

    iconBg: "bg-gradient-to-br from-orange-500 to-red-500",

    badge: "bg-red-100 text-red-600",

    button: "border border-red-200 bg-white text-red-500 hover:bg-red-50",

    background:
      "bg-[#f8fafd] bg-[linear-gradient(90deg,rgba(37,99,235,0.06)_0%,rgba(255,255,255,0)_50%,rgba(239,68,68,0.05)_100%)]",
  },
};

type TypeAnalysisCard = keyof typeof typeAnalysisCard;

type SizeAnalysisCard = "sm" | "md" | "lg";

const sizes = {
  sm: {
    container: "max-w-[490px] min-h-[140px] p-5",

    iconWrapper: "h-12 w-12",

    icon: "h-6 w-6",

    title: "text-[1.20rem]",

    description: "text-[13px]",

    button: "h-9 px-4 text-sm",
  },

  md: {
    container: "max-w-[560px] min-h-[180px] p-6",

    iconWrapper: "h-16 w-16",

    icon: "h-8 w-8",

    title: "text-3xl",

    description: "text-base",

    button: "h-11 px-6 text-base",
  },

  lg: {
    container: "max-w-[620px] min-h-[210px] p-7",

    iconWrapper: "h-20 w-20",

    icon: "h-10 w-10",

    title: "text-4xl",

    description: "text-lg",

    button: "h-12 px-7 text-lg",
  },
};

interface AnalysisCardProps {
  variant: TypeAnalysisCard;
  size?: SizeAnalysisCard;
}

export default function AnalysisCard({
  variant,
  size = "sm",
}: AnalysisCardProps) {
  const card = typeAnalysisCard[variant];

  const s = sizes[size];

  const Icon = card.icon as LucideIcon;

  return (
    <div
      className={`
        w-full
        rounded-[28px]
        border
      border-slate-200
        shadow-sm
        ${card.background}
        ${s.container}
      `}
    >
      <div className="flex gap-5">
        {/* Ícone */}
        <div
          className={`
            flex
            shrink-0
            items-center
            justify-center
            rounded-full
            shadow-md
            ${s.iconWrapper}
            ${card.iconBg}
          `}
        >
          <Icon className={`${s.icon} text-white`} />
        </div>

        {/* Conteúdo */}
        <div className="flex flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={`
                font-bold
                leading-tight
                text-slate-900
                ${s.title}
              `}
            >
              {card.title}
            </h2>

            <span
              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${card.badge}
              `}
            >
              {card.badgeText}
            </span>
          </div>

          <p
            className={`
              mt-2
              text-slate-500
              ${s.description}
            `}
          >
            {card.description}
          </p>

          <Button
            className={`
              mt-5
              w-fit
              rounded-full
              shadow-md
              ${s.button}
              ${card.button}
            `}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {card.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
