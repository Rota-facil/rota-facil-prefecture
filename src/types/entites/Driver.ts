export interface Driver {
  id: string;
  name: string;
  initials: string;
  rating: number;
  totalTrips: number;
  status: "onRoute" | "available" | "offDuty" | "waiting1";
  cpf: string;
  email: string;
  admissionDate: string;
  busPlate: string;
  documentationStatus: string;
}
