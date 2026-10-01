import { z } from 'zod'

export const mesaSchema = z.object({
  numeroMesa: z.coerce.number().int().positive(),
  capacidad: z.coerce.number().int().positive().max(30),
  estado: z.enum(['Disponible', 'Mantenimiento', 'Inactiva']),
})

export const platoSchema = z.object({
  nombre: z.string().trim().min(1).max(100),
  descripcion: z.string().trim().min(1).max(255),
  imagen: z.string().trim().max(255),
  precio: z.coerce.number().nonnegative(),
  categoria: z.string().trim().min(1).max(50),
  disponible: z.coerce.boolean(),
})

export const eventoSchema = z.object({
  nombre: z.string().trim().min(1).max(100),
  descripcion: z.string().trim().min(1).max(255),
  imagen: z.string().trim().max(255),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  estado: z.enum(['Activo', 'Inactivo']),
})

export const promocionSchema = z.object({
  titulo: z.string().trim().min(1).max(100),
  descripcion: z.string().trim().min(1).max(255),
  imagen: z.string().trim().max(255),
  descuento: z.coerce.number().min(0).max(100),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  estado: z.enum(['Activa', 'Inactiva']),
})
