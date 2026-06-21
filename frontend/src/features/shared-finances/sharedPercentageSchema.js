import { z } from 'zod'

export const sharedPercentageSchema = z.object({
  users: z
    .array(
      z.object({
        user_id: z.number(),
        name: z.string(),
        percentage: z
          .string()
          .refine((v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100, 'Debe ser un número entre 0 y 100'),
      }),
    )
    .refine(
      (users) => {
        const total = users.reduce((sum, u) => sum + Number(u.percentage), 0)
        return Math.abs(total - 100) < 0.01
      },
      { message: 'Los porcentajes deben sumar 100%' },
    ),
})
