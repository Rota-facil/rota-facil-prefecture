import {
  Bus,
  CircleX,
  GraduationCap,
  Icon,
  Route,
  Send,
  Users,
} from "lucide-react";

interface MetricCardProps {
  variants: MetricCardType;
  value: number | string;
  trend?: number;
  size?: "sm" | "md" | "lg";
}

const metricCardVariants = {
  activeRoutes: {
    icon: Route,
    iconWrapperColor: "bg-blue-300/30",
    iconColor: "blue",
    title: "Rotas ativas",
  },

  tripToday: {
    icon: Send,
    iconWrapperColor: "bg-green-300/30",
    iconColor: "green",
    title: "Viagens hoje",
  },

  cancelledTrips: {
    icon: CircleX,
    iconWrapperColor: "bg-red-300/30",
    iconColor: "red",
    title: "Viagens canceladas",
  },

  students: {
    icon: GraduationCap,
    iconWrapperColor: "bg-blue-300/30",
    iconColor: "blue",
    title: "Alunos cadastrados",
  },

  drivers: {
    icon: Users,
    iconWrapperColor: "bg-orange-700/20",
    iconColor: "brown",
    title: "Motoristas",
  },

  bus: {
    icon: Bus,
    iconWrapperColor: "bg-green-300/30",
    iconColor: "green",
    title: "Frota de ônibus",
  },
};

type MetricCardType = keyof typeof metricCardVariants;

const sizes = {
  sm: {
    container: "w-2/6 h-2/3 p-3",
    iconWrapper: "h-10 w-10",
    icon: "h-5 w-5",
    title: "text-[0.9rem]",
    value: "text-4xl",
    badge: "px-3 py-1 text-sm",
  },

  md: {
    container: "w-3/7 h-3/4 p-3",
    iconWrapper: "h-12 w-12",
    icon: "h-6 w-6",
    title: "text-base",
    value: "text-5xl",
    badge: "px-3 py-1 text-sm",
  },

  lg: {
    container: "w-2/6 h-2/3 p-3",
    iconWrapper: "h-16 w-16",
    icon: "h-8 w-8",
    title: "text-xl",
    value: "text-7xl",
    badge: "px-4 py-1.5 text-base",
  },
};

export default function MetricCard({
  variants,
  value,
  trend,
  size = "sm",
}: MetricCardProps) {
  const s = sizes[size];
  const variant = metricCardVariants[variants];

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${s.container}`}
    >
      <div className="flex h-full flex-col">
        {/* Topo */}
        <div className="flex items-start justify-between">
          <div
            className={`flex ${s.iconWrapper} items-center justify-center rounded-full  ${variant.iconWrapperColor}`}
          >
            {
              <variant.icon
                className={`${s.icon} text-blue-600`}
                color={variant.iconColor}
              ></variant.icon>
            }
          </div>

          {trend !== undefined && (
            <div
              className={`rounded-full bg-slate-100 font-medium text-slate-600 ${s.badge}`}
            >
              ↗ +{trend}
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="mt-2">
          <p className={`${s.title} text-slate-500`}>{variant.title}</p>

          <h2 className={`${s.value} font-bold leading-none text-slate-900`}>
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
}
