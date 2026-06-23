import { z } from 'zod'

export const sharedPaymentSchema = z.object({
  shared_expense_id: z.string().optional(),
  amount: z
    .string()
    .min(1, 'El monto es obligatorio')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Debe ser un número positivo'),
  paid_at: z.string().min(1, 'La fecha es obligatoria'),
  notes: z.string().max(255).optional().or(z.literal('')),
  photo: z.string().max(2048).optional().or(z.literal('')),
})
