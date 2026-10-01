import { describe, expect, it } from 'vitest'
import { createReservaSchema, reservaFiltersSchema } from '../src/schemas/reserva.schema.js'

describe('schemas de reservas', () => {
  it('acepta una reserva valida', () => {
    const result = createReservaSchema.safeParse({
      nombreCliente: 'Ana Martinez',
      numeroCliente: '5551234567',
      estadoPedido: 'Disponible',
      numeroMesa: 4,
      cantidadPersonas: 2,
    })

    expect(result.success).toBe(true)
  })

  it('rechaza estados diferentes a los permitidos', () => {
    const result = createReservaSchema.safeParse({
      nombreCliente: 'Ana Martinez',
      numeroCliente: '5551234567',
      estadoPedido: 'Pendiente',
      numeroMesa: 4,
    })

    expect(result.success).toBe(false)
  })

  it('aplica paginacion por defecto', () => {
    const result = reservaFiltersSchema.parse({})

    expect(result).toMatchObject({ page: 1, limit: 20 })
  })
})
