import { z } from 'zod'

export const loginSchema = z.object({
  usuario: z.string().trim().min(1).max(15),
  contrasena: z.string().min(1).max(72),
})

export type LoginInput = z.infer<typeof loginSchema>
