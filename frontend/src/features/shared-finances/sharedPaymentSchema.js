import { z } from 'zod'

export const sharedPaymentSchema = z.object({
  user_id: z.string().min(1, 'Selecciona un usuario'),
  amount: z
    .string()
    .min(1, 'El monto es obligatorio')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Debe ser un número positivo'),
  paid_at: z.string().min(1, 'La fecha es obligatoria'),
  notes: z.string().max(255).optional().or(z.literal('')),
})
