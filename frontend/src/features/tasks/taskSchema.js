import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(255),
  description: z.string().max(255).optional().or(z.literal('')),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly', '']).optional(),
  scheduled_at: z.string().optional().or(z.literal('')),
})
