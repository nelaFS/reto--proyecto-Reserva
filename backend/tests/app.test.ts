import { beforeAll, describe, expect, it } from 'vitest'
import app from '../src/index.js'

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters'
  process.env.JWT_ISSUER = 'reservadb-api'
  process.env.JWT_AUDIENCE = 'reservadb-client'
  process.env.CORS_ORIGIN = 'https://nookis1.infosist.org,http://localhost:4321,http://127.0.0.1:4321'
})

describe('API base', () => {
  it('responde el estado de salud', async () => {
    const response = await app.request('/health')

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  it('devuelve 404 para rutas inexistentes', async () => {
    const response = await app.request('/does-not-exist')

    expect(response.status).toBe(404)
    expect((await response.json()).error.code).toBe('NOT_FOUND')
  })

  it('valida el cuerpo del login antes de consultar la base de datos', async () => {
    const response = await app.request('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: '', contrasena: '' }),
    })

    expect(response.status).toBe(400)
    expect((await response.json()).error.code).toBe('VALIDATION_ERROR')
  })
})
