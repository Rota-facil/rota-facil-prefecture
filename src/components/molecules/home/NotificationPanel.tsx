import { Bell } from "lucide-react";
import NotificationCard from "@/components/atom/NotificationCard";

export default function NotificationPanel() {
  return (
    <div
      className={
        "flex flex-col p-4 gap-6 w-fit bg-card text-card-foreground shadow rounded-2xl border-border/70 shadow-soft"
      }
    >
      <div className={"flex  justify-between items-center"}>
        <div className={"flex justify-center items-center gap-2"}>
          <Bell size={18} />
          <h3 className={"font-bold text-[1.3rem]"}>Notificações</h3>
        </div>

        <div
          className={
            "flex justify-center items-center font-medium h-5 w-13 rounded-full bg-amber-200/70 text-accent-foreground"
          }
        >
          <p className={"text-[0.65rem]"}>3 novas</p>
        </div>
      </div>

      <div className={"flex flex-col gap-5"}>
        <NotificationCard />
        <NotificationCard statusBar={"delayReported"} />
        <NotificationCard />
      </div>
    </div>
  );
}
