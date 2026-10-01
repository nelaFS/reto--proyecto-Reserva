import { Hono } from 'hono'
import { createReservaController } from '../controllers/reserva.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { PostgresReservaRepository } from '../repositories/reserva.repository.js'
import { ReservaService } from '../services/reserva.service.js'

export function createReservaRoutes() {
  const app = new Hono()
  const controller = createReservaController(new ReservaService(new PostgresReservaRepository()))

  app.use('*', requireAuth)
  app.post('/', controller.create)
  app.patch('/:id', controller.update)
  app.get('/', controller.list)

  return app
}
