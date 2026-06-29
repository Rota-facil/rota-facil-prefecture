"use client";

import AnalysisCard from "@/components/atom/AnalysisCard";
import MetricCard from "@/components/atom/MetricCard";
import NotificationPanel from "@/components/molecules/home/NotificationPanel";
import PrefectureHomeHero from "@/components/molecules/home/PrefectureHomeHero";
import TripsInRealTime from "@/components/molecules/home/TripsInRealTime";
import { useMetrics } from "@/hooks/useMetrics";

export default function Home() {
  const { metrics } = useMetrics();

  return (
    <div className={"flex flex-col gap-4"}>
      <PrefectureHomeHero
        percentPointTrips={metrics?.percentPointTrips}
        tripsStarted={metrics?.totalTripsStarted}
        studentsServed={metrics?.studentsServed}
      />

      <div className={"flex justify-between gap-4"}>
        <AnalysisCard variant={"predictiveAnalytic"} />
        <AnalysisCard variant={"heatMap"} />
      </div>

      <div className={"flex gap-x-4 justify-between items-center"}>
        <MetricCard
          value={metrics?.activeRoutes ?? 21}
          variants={"activeRoutes"}
          size={"sm"}
        />
        <MetricCard
          value={metrics?.tripsToday ?? 65}
          variants={"tripToday"}
          size={"sm"}
        />
        <MetricCard
          value={metrics?.cancelledTrips ?? 23}
          variants={"cancelledTrips"}
          size={"sm"}
        />
      </div>

      <div className={"flex gap-x-4 justify-between items-center"}>
        <MetricCard
          value={metrics?.students ?? 46}
          variants={"students"}
          size={"sm"}
        />
        <MetricCard
          value={metrics?.drivers ?? 12}
          variants={"drivers"}
          size={"sm"}
        />
        <MetricCard value={metrics?.bus ?? 30} variants={"bus"} size={"sm"} />
      </div>

      <div className={"flex justify-between items-start gap-3 h-110"}>
        <TripsInRealTime />
        <NotificationPanel />
      </div>
    </div>
  );
}
