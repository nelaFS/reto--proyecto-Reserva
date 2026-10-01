import type { Context } from 'hono'
import { loginSchema } from '../schemas/auth.schema.js'
import type { AuthService } from '../services/auth.service.js'

export function createAuthController(service: AuthService) {
  return {
    login: async (c: Context) => {
      const body = loginSchema.parse(await c.req.json())
      const result = await service.login(body)
      return c.json({ data: result }, 200)
    },

    logout: (c: Context) => c.json({
      data: {
        message: 'Sesion cerrada. El cliente debe eliminar el token.',
      },
    }, 200),
  }
}
