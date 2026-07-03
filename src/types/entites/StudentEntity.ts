export type StudentStatus = "ACTIVE" | "INACTIVE";

export interface StudentEntity {
  id: string;
  code: string;
  name: string;
  email: string;
  frequency: number;
  score: number;
  status: StudentStatus;
}
