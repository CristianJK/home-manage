import { z } from 'zod'

export const personalExpenseSchema = z.object({
  concept: z.string().min(1, 'El concepto es obligatorio').max(255),
  amount: z
    .string()
    .min(1, 'El monto es obligatorio')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Debe ser un número positivo'),
  category: z.string().min(1, 'La categoría es obligatoria'),
})
