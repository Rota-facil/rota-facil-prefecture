import { Car, FileText, Phone, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DriverCardProps {
  initials: string;
  name: string;
  rating: number;
  trips: number;
  vehicle: string;
  documentsStatus?: string;
  status: "onRoute" | "available";
  size?: "sm" | "md";
}

const statusConfig = {
  onRoute: {
    text: "Em rota",
    className: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  },

  available: {
    text: "Disponível",
    className: "bg-blue-50 text-blue-600 border border-blue-200",
  },
};

const sizes = {
  sm: {
    container: "w-[370px] h-[190px] p-5",
    avatar: "h-[60px] w-[60px] text-[18px]",
    title: "text-[15px]",
    badge: "h-6 min-w-[75px] px-2.5 text-[10px]",
    chip: "h-8 px-3 text-[13px]",
    button: "h-10 text-sm",
    phone: "h-10 w-10",
  },

  md: {
    container: "w-[400px] h-[210px] p-5",
    avatar: "h-[70px] w-[70px] text-[22px]",
    title: "text-[15px]",
    badge: "h-9 min-w-[70px] px-3 text-sm",
    chip: "h-9 px-4 text-sm",
    button: "h-11 text-sm",
    phone: "h-11 w-11",
  },
};

export default function DriverCard({
  initials,
  name,
  rating,
  trips,
  vehicle,
  documentsStatus = "Docs: Em dia",
  status,
  size = "sm",
}: DriverCardProps) {
  const s = sizes[size];
  const currentStatus = statusConfig[status];

  return (
    <div
      className={`
        rounded-[32px]
        border
        border-slate-200
        bg-white
        shadow-sm
        ${s.container}
      `}
    >
      <div className="flex h-full flex-col justify-between">
        {/* TOPO */}
        <div className="flex gap-4">
          {/* Avatar */}
          <div
            className={`
              flex
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-blue-700
              font-bold
              text-white
              shadow-md
              ${s.avatar}
            `}
          >
            {initials}
          </div>

          {/* Conteúdo */}
          <div className="flex flex-1 flex-col">
            {/* Nome + status */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className={`
                    font-bold
                    text-slate-900
                    ${s.title}
                  `}
                >
                  {name}
                </h2>

                <div className="mt-1 flex items-center gap-4 text-[15px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{rating}</span>
                  </div>

                  <span>{trips} viagens</span>
                </div>
              </div>

              <div
                className={`
                  flex
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  font-medium
                  whitespace-nowrap
                  ${currentStatus.className}
                  ${s.badge}
                `}
              >
                ● {currentStatus.text}
              </div>
            </div>

            {/* Chips */}
            <div className="mt-3 flex gap-2">
              <div
                className={`
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-slate-100
                  whitespace-nowrap
                  ${s.chip}
                `}
              >
                <Car className="h-3.5 w-3.5 shrink-0" />
                <span>{vehicle}</span>
              </div>

              <div
                className={`
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-slate-100
                  whitespace-nowrap
                  ${s.chip}
                `}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>{documentsStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-4 flex items-center gap-3">
          <Button
            variant="ghost"
            className={`
              flex-1
              rounded-full
              bg-slate-100
              text-slate-900
              shadow-sm
              hover:bg-slate-200
              ${s.button}
            `}
          >
            Ver perfil
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`
              rounded-full
              ${s.phone}
            `}
          >
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
