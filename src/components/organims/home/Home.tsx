import { MapIcon } from "lucide-react";
import AnalysisCard from "@/components/atom/AnalysisCard";
import MetricCard from "@/components/atom/MetricCard";
import NotificationPanel from "@/components/molecules/home/NotificationPanel";
import PrefectureHomeHero from "@/components/molecules/home/PrefectureHomeHero";
import TripsInRealTime from "@/components/molecules/home/TripsInRealTime";

export default function Home() {
  return (
    <div className={"flex flex-col gap-4"}>
      <PrefectureHomeHero />

      <div className={"flex justify-between gap-4"}>
        <AnalysisCard variant={"predictiveAnalytic"} />
        <AnalysisCard variant={"heatMap"} />
      </div>

      <div className={"flex gap-x-4 justify-between items-center"}>
        <MetricCard value={21} variants={"activeRoutes"} size={"sm"} />
        <MetricCard value={65} variants={"tripToday"} size={"sm"} />
        <MetricCard value={19} variants={"cancelledTrips"} size={"sm"} />
      </div>

      <div className={"flex gap-x-4 justify-between items-center"}>
        <MetricCard value={46} variants={"students"} size={"sm"} />
        <MetricCard value={12} variants={"drivers"} size={"sm"} />
        <MetricCard value={30} variants={"bus"} size={"sm"} />
      </div>

      <div className={"flex justify-between items-start gap-3 h-110"}>
        <TripsInRealTime />
        <NotificationPanel />
      </div>
    </div>
  );
}
