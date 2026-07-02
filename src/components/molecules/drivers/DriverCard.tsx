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
    container: "w-[365px] h-[190px] p-5",
    title: "text-[15px]",
    button: "h-10 text-sm",
  },

  md: {
    container: "w-[400px] h-[210px] p-5",
    title: "text-[16px]",
    button: "h-11 text-sm",
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
        <div className="flex gap-4">
          <DriverAvatar initials={initials} size={size} />

          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
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

                <div className="mt-1 flex items-center gap-4 text-[14px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{rating}</span>
                  </div>
                  <span>{trips} viagens</span>
                </div>
              </div>

              <StatusBar variant={status} size="sm" />
            </div>

            <div className="mt-3 flex gap-2">
              <DriverChip icon={Car} text={vehicle} size={size} />
              <DriverChip icon={FileText} text={documentsStatus} size={size} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            onClick={onViewProfile}
            variant="ghost"
            className={`
              flex-1
              rounded-full
              bg-slate-100
              text-slate-900
              shadow-sm
              transition-colors
              duration-200
              hover:bg-orange-400
              hover:text-orange-800
              cursor-pointer
              ${s.button}
            `}
          >
            Ver perfil
          </Button>

          <Button
            type="button"
            onClick={onDelete}
            variant="ghost"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-700 shadow-sm transition-colors duration-200 hover:bg-orange-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
