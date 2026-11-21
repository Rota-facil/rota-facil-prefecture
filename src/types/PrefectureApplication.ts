export type ApplicationStatus = "ANALYSIS" | "APPROVED" | "REJECTED";

export interface PrefectureApplicationForm {
  prefectureName: string;
  municipality: string;
  state: string;
  ibgeCode: string;
  cnpj: string;
  institutionalEmail: string;
  institutionalPhone: string;
  responsibleName: string;
  responsibleRole: string;
  responsibleCpf: string;
  responsibleEmail: string;
  responsiblePhone: string;
  privacyAccepted: boolean;
}

export interface PrefectureApplicationSummary {
  id: string;
  name: string;
  municipality: string;
  state: string;
  cnpj?: string;
  ibgeCode?: string;
  institutionalEmail: string;
  institutionalPhone: string;
  responsibleName: string;
  responsibleEmail: string;
  responsiblePhone: string;
  responsibleCpf?: string;
  status: ApplicationStatus;
  rejectionReason?: string | null;
  reviewedId?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDocument {
  id: string;
  originalFilename: string;
  url: string;
  fileCategory: string;
  createdAt: string;
}

export interface ApplicationHistoryEvent {
  id: string;
  status: ApplicationStatus;
  description: string;
  createdAt: string;
}

export interface PrefectureApplicationDetails
  extends PrefectureApplicationSummary {
  documents?: ApplicationDocument[];
  responsibleRole?: string;
  history?: ApplicationHistoryEvent[];
  internalNotes?: Array<{
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
}

export interface ApplicationStats {
  total: number;
  analysis: number;
  approved: number;
  rejected: number;
}
