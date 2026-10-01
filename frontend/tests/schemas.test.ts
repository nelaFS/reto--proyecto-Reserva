import { describe, expect, it } from 'vitest'
import { loginFormSchema, reservaFormSchema } from '../src/lib/schemas'

describe('schemas del frontend', () => {
  it('acepta credenciales validas', () => {
    expect(loginFormSchema.safeParse({ usuario: 'sabinofc', contrasena: '123456' }).success).toBe(true)
  })

  it('rechaza telefonos invalidos', () => {
    expect(reservaFormSchema.safeParse({
      nombreCliente: 'Ana',
      numeroCliente: 'abc',
      estadoPedido: 'Disponible',
      numeroMesa: '2',
      cantidadPersonas: '2',
      fechaReserva: '2026-10-01T20:00',
    }).success).toBe(false)
  })

  it('acepta los estados definidos por el backend', () => {
    expect(reservaFormSchema.safeParse({
      nombreCliente: 'Ana',
      numeroCliente: '912 345 678',
      estadoPedido: 'Cancelado',
      numeroMesa: '2',
      cantidadPersonas: '2',
      fechaReserva: '2026-10-01T20:00',
    }).success).toBe(true)
  })
})
