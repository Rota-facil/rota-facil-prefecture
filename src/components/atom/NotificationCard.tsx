import StatusBar, { type TypeStatusBar } from "@/components/atom/statusBar";

type NotificationCardProps = {
  statusBar?: TypeStatusBar;
  time?: string;
  description?: string;
};

export default function NotificationCard(props: NotificationCardProps) {
  return (
    <div
      className={
        "flex flex-col w-80 gap-2 wrap-break-word rounded-xl border border-border/60 bg-slate-50 p-4"
      }
    >
      <div className={"flex justify-between"}>
        <StatusBar variant={props.statusBar ?? "canceledTrip"} size={"sm"} />
        <p className={"text-[11px] text-muted-foreground"}>
          {props.time ?? "ha 12 minutos"}
        </p>
      </div>

      <p className={"mt-2 text-sm text-foreground/90"}>
        {props.description ?? "Rota R-04 cancelada — motorista indisponível."}
      </p>
    </div>
  );
}
