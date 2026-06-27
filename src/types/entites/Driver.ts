export interface Driver {
  id: string;
  name: string;
  initials: string;
  rating: number;
  totalTrips: number;
  status: "onRoute" | "available" | "offDuty" | "waiting1";
  cpf: string;
  cnh: string;
  cnhCategory: string;
  phone: string;
  email: string;
  address: string;
  admissionDate: string;
  busPlate: string;
  documentationStatus: string;
}
