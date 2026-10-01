import type { Context } from 'hono'
import { createReservaSchema, reservaFiltersSchema, reservaIdSchema, updateReservaSchema } from '../schemas/reserva.schema.js'
import type { ReservaService } from '../services/reserva.service.js'

export function createReservaController(service: ReservaService) {
  return {
    create: async (c: Context) => {
      const body = createReservaSchema.parse(await c.req.json())
      const reserva = await service.create(body)
      return c.json({ data: reserva }, 201)
    },

    update: async (c: Context) => {
      const id = reservaIdSchema.parse(c.req.param('id'))
      const body = updateReservaSchema.parse(await c.req.json())
      const reserva = await service.update(id, body)
      return c.json({ data: reserva }, 200)
    },

    list: async (c: Context) => {
      const filters = reservaFiltersSchema.parse(c.req.query())
      const result = await service.list(filters)
      return c.json({
        data: result.data,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / filters.limit),
        },
      }, 200)
    },

    available: async (c: Context) => {
      const fechaReserva = c.req.query('fechaReserva')
      const cantidadPersonas = Number(c.req.query('cantidadPersonas'))
      if (!fechaReserva || !Number.isInteger(cantidadPersonas) || cantidadPersonas < 1) {
        return c.json({ error: { code: 'VALIDATION_ERROR', message: 'fechaReserva y cantidadPersonas son obligatorios' } }, 400)
      }
      return c.json({ data: await service.listAvailable(fechaReserva, cantidadPersonas) }, 200)
    },

    publicCreate: async (c: Context) => {
      const body = createReservaSchema.parse(await c.req.json())
      if (!body.fechaReserva) {
        return c.json({ error: { code: 'VALIDATION_ERROR', message: 'La fecha de reserva es obligatoria' } }, 400)
      }
      const available = await service.listAvailable(body.fechaReserva ?? '', body.cantidadPersonas)
      if (!available.some((mesa) => mesa.numeroMesa === body.numeroMesa)) {
        return c.json({ error: { code: 'TABLE_UNAVAILABLE', message: 'La mesa no esta disponible para ese horario' } }, 409)
      }
      const reserva = await service.create(body)
      return c.json({ data: reserva }, 201)
    },
  }
}
