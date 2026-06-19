import { z } from 'zod'

export const savingGoalSchema = z.object({
  target_name: z.string().min(1, 'El nombre es obligatorio').max(255),
  category: z.string().optional().or(z.literal('')),
  target_amount: z
    .string()
    .min(1, 'El monto es obligatorio')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Debe ser un número positivo'),
  deadline: z.string().min(1, 'La fecha límite es obligatoria'),
  current_amount: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(Number(v)) && Number(v) >= 0), 'Debe ser un número válido'),
})
