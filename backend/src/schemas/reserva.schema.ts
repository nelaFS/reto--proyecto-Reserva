import { z } from 'zod'

const dateTime = z.string().regex(/^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2})?$/, 'Usa el formato YYYY-MM-DD HH:mm:ss')

export const estadoPedidoSchema = z.enum(['Disponible', 'Cancelado'])

export const createReservaSchema = z.object({
  nombreCliente: z.string().trim().min(1).max(100),
  numeroCliente: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/),
  estadoPedido: estadoPedidoSchema,
  numeroMesa: z.coerce.number().int().positive(),
  cantidadPersonas: z.coerce.number().int().min(1).max(30),
  fechaReserva: dateTime.optional(),
})

export const updateReservaSchema = createReservaSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Debe enviar al menos un campo para actualizar',
)

export const reservaIdSchema = z.coerce.number().int().positive()

export const reservaFiltersSchema = z.object({
  estado: estadoPedidoSchema.optional(),
  fechaDesde: dateTime.optional(),
  fechaHasta: dateTime.optional(),
  numeroMesa: z.coerce.number().int().positive().optional(),
  nombreCliente: z.string().trim().min(1).max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type CreateReservaInput = z.infer<typeof createReservaSchema>
export type UpdateReservaInput = z.infer<typeof updateReservaSchema>
