import { z } from 'zod'

export const sharedExpenseSchema = z.object({
  concept: z.string().min(1, 'El concepto es obligatorio'),
  amount: z
    .string()
    .min(1, 'El monto es obligatorio')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Debe ser un número positivo'),
  frequency: z.string().min(1, 'La frecuencia es obligatoria'),
  due_date: z.string().min(1, 'La fecha es obligatoria'),
  is_paid: z.string(),
  comment: z.string().max(255).optional().or(z.literal('')),
})
