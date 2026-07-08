"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell } from "lucide-react";
import NotificationCard from "@/components/atom/NotificationCard";
import { UseNotifications } from "@/hooks/UseNotifications";
import { NotificationMap } from "@/types/enums/NotificationType";

export default function NotificationPanel() {
  const { notificationsPage } = UseNotifications();

  const notifications = notificationsPage?.content;

  return (
    <div
      className={
        "flex h-full w-2/7 min-w-80 flex-col gap-6 rounded-2xl border-border/70 bg-card p-4 text-card-foreground shadow shadow-soft"
      }
    >
      <div className={"flex justify-between items-center"}>
        <div className={"flex justify-center items-center gap-2"}>
          <Bell size={17} />
          <h3 className={"font-bold text-[1.2rem]"}>Notificações</h3>
        </div>

        <div
          className={
            "flex justify-center items-center font-medium h-5 w-13 rounded-full bg-amber-200/70 text-accent-foreground"
          }
        >
          <p
            className={"text-[0.65rem]"}
          >{`${notifications?.length ?? "3"} novas`}</p>
        </div>
      </div>

      <div className={"flex flex-col gap-5"}>
        {notifications === undefined ? (
          <>
            <NotificationCard statusBar="canceledTrip" />
            <NotificationCard statusBar="canceledTrip" />
            <NotificationCard statusBar="canceledTrip" />
          </>
        ) : notifications.length === 0 ? (
          <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm font-medium text-slate-500">
            Nenhuma notificação recente.
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              statusBar={NotificationMap[n.notificationType].value}
              description={n.message}
              time={formatDistanceToNow(new Date(n.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            />
          ))
        )}
      </div>
    </div>
  );
}
