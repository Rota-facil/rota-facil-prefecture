export type ApplicationStatus =
  | "UNDER_ANALYSIS"
  | "ADDITIONAL_INFO_REQUIRED"
  | "APPROVED"
  | "REJECTED";

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
  responsibleEmail: string;
  responsiblePhone: string;
  privacyAccepted: boolean;
}

export interface PrefectureApplicationSummary {
  id: string;
  protocol: string;
  prefectureName: string;
  municipality: string;
  state: string;
  cnpj: string;
  responsibleName: string;
  requestedAt: string;
  status: ApplicationStatus;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  url?: string;
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
  institutionalEmail: string;
  institutionalPhone: string;
  ibgeCode?: string;
  responsibleRole: string;
  responsibleEmail: string;
  responsiblePhone: string;
  documents: ApplicationDocument[];
  history: ApplicationHistoryEvent[];
  internalNotes: Array<{
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
  publicMessage?: string;
}

export interface ApplicationStats {
  total: number;
  underAnalysis: number;
  approved: number;
  rejected: number;
  additionalInfoRequired: number;
}
