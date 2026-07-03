import type { NotificationType } from "@/types/enums/NotificationType";
import type { Priority } from "@/types/enums/Priority";
import type { RecipientType } from "@/types/enums/RecipientType";
import type { TargetType } from "@/types/enums/TargetType";

export interface NotificationEntity {
  id: string;
  recipientId: string;
  recipientType: RecipientType;
  notificationType: NotificationType;
  title: string;
  message: string;
  targetType: TargetType;
  targetId: string;
  priority: Priority;
  createdAt: Date;
}
