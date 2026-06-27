import { z } from "zod";

export const driverSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),

  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (ex: 123.456.789-00)"),

  cnh: z.string().min(9, "CNH deve ter ao menos 9 dígitos"),

  cnhCategory: z.string().min(1, "Categoria obrigatória"),

  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone inválido (ex: (31) 99999-1234)",
    ),

  email: z.string().email("E-mail inválido"),

  address: z.string().min(5, "Endereço obrigatório"),

  admissionDate: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida (ex: 12/03/2019)"),

  busPlate: z.string().min(3, "Placa obrigatória"),

  documentationStatus: z.string().min(1, "Status de documentação obrigatório"),
});

export type DriverFormData = z.infer<typeof driverSchema>;
