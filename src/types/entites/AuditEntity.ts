export type AuditRole =
  | "STUDENT"
  | "DRIVER"
  | "ADMIN"
  | "SUPERUSER"
  | "PREFECTURE"
  | string;

export type AuditActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "FEEDBACK"
  | "LOGOUT"
  | string;

export interface AuditEntity {
  id: string;
  userId: string;
  prefectureId?: string;
  email: string;
  role: AuditRole;
  actionTitle: string;
  actionType: AuditActionType;
  resourceName: string;
  resourceId: string;
  date: string;
}
