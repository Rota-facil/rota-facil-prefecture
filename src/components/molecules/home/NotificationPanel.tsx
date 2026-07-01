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
        "flex flex-col p-4 gap-6 w-fit bg-card text-card-foreground shadow rounded-2xl border-border/70 shadow-soft h-full"
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
