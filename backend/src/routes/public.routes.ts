import { Hono } from 'hono'
import { createReservaController } from '../controllers/reserva.controller.js'
import { PostgresReservaRepository } from '../repositories/reserva.repository.js'
import { ReservaService } from '../services/reserva.service.js'
import { createContentRoutes } from './content.routes.js'

export function createPublicRoutes() {
  const app = new Hono()
  const controller = createReservaController(new ReservaService(new PostgresReservaRepository()))
  app.get('/mesas/disponibles', controller.available)
  app.post('/reservas', controller.publicCreate)
  app.route('/menu', createContentRoutes('menu', false))
  app.route('/eventos', createContentRoutes('eventos', false))
  app.route('/promociones', createContentRoutes('promociones', false))
  app.route('/mesas', createContentRoutes('mesas', false))
  return app
}
