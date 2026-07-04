import { Car, FileText, Star, Trash2 } from "lucide-react";

import DriverAvatar from "@/components/atom/DriverAvatar";
import DriverChip from "@/components/atom/DriverChip";
import StatusBar from "@/components/atom/statusBar";
import { Button } from "@/components/ui/button";

interface DriverCardProps {
  initials: string;
  name: string;
  rating: number;
  trips: number;
  vehicle: string;
  documentsStatus?: string;
  status: "onRoute" | "available" | "offDuty" | "waiting1";
  size?: "sm" | "md";
  onViewProfile?: () => void;
  onDelete?: () => void;
}

const sizes = {
  sm: {
    avatar: "sm",
    title: "text-base",
    button: "h-8 text-xs",
    chip: "sm",
    status: "sm",
  },

  md: {
    avatar: "md",
    title: "text-lg",
    button: "h-9 text-sm",
    chip: "md",
    status: "md",
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
  onViewProfile,
  onDelete,
}: DriverCardProps) {
  const s = sizes[size];

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-[#E5EAF0]
        bg-white

        shadow-[0_18px_45px_-28px_rgba(15,23,42,0.45)]

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:shadow-[0_22px_52px_-30px_rgba(15,23,42,0.5)]
      "
    >
      <div className="p-4">
        <div className="flex gap-4">
          <DriverAvatar initials={initials} size={s.avatar as "sm" | "md"} />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3
                  className={`
                    truncate
                    font-semibold
                    text-slate-950
                    ${s.title}
                  `}
                >
                  {name}
                </h3>

                <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                    <span>{rating}</span>
                  </div>

                  <span>{trips} viagens</span>
                </div>
              </div>

              <StatusBar variant={status} size={s.status as "sm" | "md"} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <DriverChip
                icon={Car}
                text={vehicle}
                size={s.chip as "sm" | "md"}
              />

              <DriverChip
                icon={FileText}
                text={documentsStatus}
                size={s.chip as "sm" | "md"}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onViewProfile}
            className="
              h-8
              flex-1

              cursor-pointer

              rounded-xl

              border-[#E5EAF0]

              text-xs
              font-semibold

              text-slate-700

              transition-all

              hover:bg-[#EEF2F7]
            "
          >
            Ver perfil
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={onDelete}
            aria-label="Excluir motorista"
            className="
              h-8
              w-8

              cursor-pointer

              rounded-xl

              text-slate-400

              transition-all

              hover:bg-red-50
              hover:text-[#DC2626]
            "
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
