import PhotoWithNameAndDescriptions from "@/components/atom/PhotoWithNameAndDescriptions";
import StatusBar from "@/components/atom/statusBar";

export default function ColumnTripInRealTime() {
  return (
    <div className={"flex justify-between cursor-pointer"}>
      <div>
        <PhotoWithNameAndDescriptions size={"sm"} />
      </div>

      <div>
        <StatusBar variant={"inRoute"} size={"sm"} />
      </div>
    </div>
  );
}
