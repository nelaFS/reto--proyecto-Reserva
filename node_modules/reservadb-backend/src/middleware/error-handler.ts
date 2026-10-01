import type { ErrorHandler } from 'hono'
import { ZodError } from 'zod'
import { AppError, isAppError } from '../lib/errors.js'

export const errorHandler: ErrorHandler = (error, c) => {
  if (error instanceof ZodError) {
    return c.json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Los datos enviados no son validos',
        details: error.issues,
      },
    }, 400)
  }

  if (isAppError(error)) {
    return c.json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    }, error.status as 400 | 401 | 404 | 409 | 500)
  }

  if (isDatabaseError(error)) {
    console.error('Database error:', error.code)
    if (error.code === '23505') {
      return c.json({
        error: {
          code: 'CONFLICT',
          message: 'El registro que intentas crear ya existe.',
        },
      }, 409)
    }
    return c.json({
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'No se pudo conectar con la base de datos. Verifica DATABASE_URL, DATABASE_SSL y las credenciales de PostgreSQL.',
      },
    }, 503)
  }

  console.error(error)
  return c.json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocurrio un error interno',
    },
  }, 500)
}

function isDatabaseError(error: unknown): error is { code: string } {
  if (!error || typeof error !== 'object' || !('code' in error)) return false
  const code = String((error as { code: unknown }).code)
  return ['23505', '28P01', '3D000', '42P01', 'ECONNREFUSED', 'ECONNRESET', 'ENOTFOUND', 'ETIMEDOUT'].includes(code)
}
