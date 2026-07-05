export type AuditRole = "STUDENT" | "DRIVER" | "ADMIN" | "PREFECTURE";

export type AuditActionType = "CREATE" | "UPDATE" | "DELETE" | "FEEDBACK";

export interface AuditEntity {
  id: string;
  userId: string;
  email: string;
  role: AuditRole;
  actionTitle: string;
  actionType: AuditActionType;
  resourceName: string;
  resourceId: string;
  date: string;
}
