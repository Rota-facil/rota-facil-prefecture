import { z } from "zod";

export const driverSchema = z.object({
  name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (ex: 123.456.789-00)"),
  email: z.string().email("E-mail inválido"),
  busPlate: z.string().min(3, "Placa obrigatória"),
});

export type DriverFormData = z.infer<typeof driverSchema>;
