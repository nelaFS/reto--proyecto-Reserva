import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { createAuthController } from '../controllers/auth.controller.js'
import { AuthService } from '../services/auth.service.js'
import { PostgresAdministradorRepository } from '../repositories/administrador.repository.js'

export function createAuthRoutes() {
  const app = new Hono()
  const controller = createAuthController(new AuthService(new PostgresAdministradorRepository()))

  app.post('/login', controller.login)
  app.post('/logout', requireAuth, controller.logout)

  return app
}
