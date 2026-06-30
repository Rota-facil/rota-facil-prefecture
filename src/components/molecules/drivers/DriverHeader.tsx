import { Star, X } from "lucide-react";
import DriverAvatar from "@/components/atom/DriverAvatar";
import StatusBar from "@/components/atom/statusBar";
import type { Driver } from "@/types/entites/Driver";

interface DriverHeaderProps {
  driver: Driver;
  onClose: () => void;
}

export default function DriverHeader({ driver, onClose }: DriverHeaderProps) {
  return (
    <div className="relative flex items-center gap-5 rounded-t-2xl bg-gradient-to-r from-blue-700 to-blue-500 px-7 py-6">
      <DriverAvatar initials={driver.initials} size="md" />

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">{driver.name}</h2>

        <div className="flex items-center gap-3 text-sm">
          <div className={"flex gap-1"}>
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-white">{driver.rating}</span>
          </div>

          <StatusBar variant={driver.status} size="sm" />
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
