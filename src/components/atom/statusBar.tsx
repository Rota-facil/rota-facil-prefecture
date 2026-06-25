const typeStatusBar = {
  progress: {
    ballColor: "bg-green-600",
    textColor: "text-white",
    background: "bg-white/15",
    text: "Operação em curso",
  },

  inRoute: {
    ballColor: "bg-green-600",
    textColor: "text-green-500",
    background: "bg-green-400/15 b-green-400 border border-green-300",
    text: "Em rota",
  },

  embarking: {
    ballColor: "bg-blue-600",
    textColor: "text-blue-500",
    background: "bg-blue-400/15 b-blue-400 border border-blue-300",
    text: "Embarcando",
  },

  waiting: {
    ballColor: "bg-amber-600",
    textColor: "text-amber-500",
    background: "bg-amber-400/15 b-amber-400 border border-amber-300",
    text: "Aguardando",
  },

  cancelled: {
    ballColor: "bg-red-600",
    textColor: "text-red-500",
    background: "bg-red-400/15 b-red-400 border border-red-300",
    text: "Cancelado",
  },
};

const sizes = {
  sm: {
    container: "gap-1 rounded-xl px-2 py-0.4",
    ball: "h-1.5 w-1.5",
    text: "text-[0.8rem]",
  },

  md: {
    container: "gap-2 rounded-2xl px-3 py-1",
    ball: "h-2 w-2",
    text: "text-sm",
  },

  lg: {
    container: "gap-2.5 rounded-3xl px-4 py-2",
    ball: "h-2.5 w-2.5",
    text: "text-base",
  },
};

type TypeStatusBar = keyof typeof typeStatusBar;
type SizeStatusBar = keyof typeof sizes;

type StatusBarProps = {
  variant: TypeStatusBar;
  size?: SizeStatusBar;
};

export default function StatusBar({ variant, size = "md" }: StatusBarProps) {
  const status = typeStatusBar[variant];
  const s = sizes[size];

  return (
    <div
      className={`inline-flex w-fit items-center font-medium ${status.background} ${s.container}`}
    >
      <div className={`${status.ballColor} ${s.ball} rounded-full`} />

      <p className={`${status.textColor} ${s.text}`}>{status.text}</p>
    </div>
  );
}
