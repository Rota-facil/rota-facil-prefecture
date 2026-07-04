import {
  CalendarCheck,
  Download,
  Route,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const reportVariants = {
  dailyPresence: {
    title: "Presença diária",
    description: "Resumo de presenças e ausências por rota.",
    icon: CalendarCheck,

    iconBackground: "bg-blue-100",
    iconColor: "text-blue-700",

    button:
      "bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white",
  },

  studentFrequency: {
    title: "Frequência por aluno",
    description: "Percentual de frequência no período.",
    icon: UserRoundCheck,

    iconBackground: "bg-emerald-100",
    iconColor: "text-emerald-600",

    button:
      "bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white",
  },

  cancelledTrips: {
    title: "Viagens canceladas",
    description: "Histórico e motivos de cancelamentos.",
    icon: XCircle,

    iconBackground: "bg-red-100",
    iconColor: "text-red-500",

    button:
      "bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white",
  },

  routeUsage: {
    title: "Utilização de rotas",
    description: "Ocupação média e desempenho por rota.",
    icon: Route,

    iconBackground: "bg-amber-100",
    iconColor: "text-amber-700",

    button:
      "bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-white",
  },
};

const sizes = {
  sm: {
    container: "max-w-[550px] p-6",
    iconWrapper: "h-14 w-14",
    icon: "h-7 w-7",
    title: "text-[1.55rem]",
    description: "text-sm",
    button: "h-11 text-sm",
  },

  md: {
    container: "max-w-[600px] p-7",
    iconWrapper: "h-16 w-16",
    icon: "h-8 w-8",
    title: "text-[1.8rem]",
    description: "text-base",
    button: "h-12 text-base",
  },
};

type ReportVariant = keyof typeof reportVariants;
type ReportSize = keyof typeof sizes;

interface ReportCardProps {
  variant: ReportVariant;
  size?: ReportSize;
}

export default function ReportCard({ variant, size = "sm" }: ReportCardProps) {
  const report = reportVariants[variant];
  const s = sizes[size];

  const Icon = report.icon;

  return (
    <div
      className={`
        w-full
        ${s.container}

        rounded-[30px]
        border
        border-slate-200

        bg-gradient-to-r
        from-[#f8fafd]
        via-white
        to-white

        shadow-sm

        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-lg
      `}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div
            className={`
              flex
              shrink-0
              items-center
              justify-center
              rounded-full

              ${report.iconBackground}
              ${s.iconWrapper}
            `}
          >
            <Icon className={`${report.iconColor} ${s.icon}`} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              className={`
                font-bold
                text-slate-900
                ${s.title}
              `}
            >
              {report.title}
            </h2>

            <p
              className={`
                mt-1
                text-slate-500
                ${s.description}
              `}
            >
              {report.description}
            </p>
          </div>
        </div>

        <Button
          className={`
          h-full
          w-full
          rounded-full

          ${s.button}

          cursor-pointer
          disabled:cursor-not-allowed

          shadow-md
          transition-all
          duration-200

          hover:scale-[1.01]
          hover:shadow-lg

          active:scale-[0.98]

          ${report.button}
      `}
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
    </div>
  );
}
