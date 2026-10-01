import { z } from 'zod'

export const loginFormSchema = z.object({
  usuario: z.string().trim().min(1, 'Ingresa tu usuario.').max(15, 'El usuario es demasiado largo.'),
  contrasena: z.string().min(1, 'Ingresa tu contrasena.').max(72, 'La contrasena es demasiado larga.'),
})

export const reservaFormSchema = z.object({
  nombreCliente: z.string().trim().min(1, 'Ingresa el nombre del cliente.').max(100, 'El nombre es demasiado largo.'),
  numeroCliente: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, 'Ingresa un telefono valido.'),
  estadoPedido: z.enum(['Disponible', 'Cancelado']),
  numeroMesa: z.coerce.number().int().positive('La mesa debe ser un numero positivo.'),
  cantidadPersonas: z.coerce.number().int().min(1, 'Indica al menos una persona.').max(30),
  fechaReserva: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Selecciona una fecha y hora validas.'),
})

export type LoginForm = z.infer<typeof loginFormSchema>
export type ReservaForm = z.infer<typeof reservaFormSchema>
