import PrefectureHomeHero from "@/components/molecules/home/PrefectureHomeHero";
import TripsInRealTime from "@/components/molecules/home/TripsInRealTime";

export default function HomePage() {
  return (
    <div className={"w-full h-screen flex flex-col"}>
      <PrefectureHomeHero />
      <TripsInRealTime />
    </div>
  );
}
