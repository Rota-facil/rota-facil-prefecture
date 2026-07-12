import StatusBar, { type TypeStatusBar } from "@/components/atom/statusBar";

export type NotificationStatus = Extract<
  TypeStatusBar,
  "available" | "canceledTrip" | "delayReported" | "embarking" | "onRoute"
>;

type NotificationCardProps = {
  statusBar?: NotificationStatus;
  time?: string;
  description?: string;
};

export default function NotificationCard(props: NotificationCardProps) {
  return (
    <div
      className={
        "flex flex-col w-fit gap-2 wrap-break-word rounded-xl border border-border/60 bg-slate-50 p-4"
      }
    >
      <div className={"flex justify-between"}>
        <StatusBar variant={props.statusBar ?? "canceledTrip"} size={"xsm"} />
        <p className={"text-[0.6rem] text-muted-foreground"}>
          {props.time ?? "ha 12 minutos"}
        </p>
      </div>

      <p className={"mt-2 text-[0.8rem] text-foreground/90"}>
        {props.description ?? "Rota R-04 cancelada — motorista indisponível."}
      </p>
    </div>
  );
}
