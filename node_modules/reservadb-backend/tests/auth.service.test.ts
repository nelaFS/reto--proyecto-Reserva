import { beforeEach, describe, expect, it } from 'vitest'
import { resetConfigForTests } from '../src/lib/config.js'
import { hashPassword } from '../src/lib/password.js'
import { AuthService } from '../src/services/auth.service.js'
import type { AdministradorRepository } from '../src/repositories/administrador.repository.js'

describe('AuthService', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters'
    process.env.JWT_ISSUER = 'reservadb-api'
    process.env.JWT_AUDIENCE = 'reservadb-client'
    process.env.JWT_EXPIRES_IN = '1h'
    process.env.CORS_ORIGIN = 'https://nookis1.infosist.org,http://localhost:4321,http://127.0.0.1:4321'
    resetConfigForTests()
  })

  it('crea un JWT con credenciales validas', async () => {
    const repository: AdministradorRepository = {
      findByUsuario: async () => ({
        identificador: 1,
        usuario: 'sabinofc',
        contrasena: await hashPassword('123456'),
      }),
    }

    const result = await new AuthService(repository).login({
      usuario: 'sabinofc',
      contrasena: '123456',
    })

    expect(result.accessToken.split('.')).toHaveLength(3)
    expect(result.tokenType).toBe('Bearer')
  })

  it('rechaza credenciales invalidas', async () => {
    const repository: AdministradorRepository = {
      findByUsuario: async () => ({
        identificador: 1,
        usuario: 'sabinofc',
        contrasena: await hashPassword('123456'),
      }),
    }

    await expect(new AuthService(repository).login({
      usuario: 'sabinofc',
      contrasena: 'incorrecta',
    })).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', status: 401 })
  })
})
