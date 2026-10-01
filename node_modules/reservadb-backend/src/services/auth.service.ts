import { AppError } from '../lib/errors.js'
import { getConfig } from '../lib/config.js'
import { createAccessToken } from '../lib/jwt.js'
import { comparePassword } from '../lib/password.js'
import type { AdministradorRepository } from '../repositories/administrador.repository.js'
import type { LoginInput } from '../schemas/auth.schema.js'

export class AuthService {
  constructor(private readonly administrators: AdministradorRepository) {}

  async login(input: LoginInput): Promise<{ accessToken: string; tokenType: 'Bearer'; expiresIn: string }> {
    const administrator = await this.administrators.findByUsuario(input.usuario)
    const validPassword = administrator
      ? await comparePassword(input.contrasena, administrator.contrasena)
      : false

    if (!administrator || !validPassword) {
      throw new AppError('INVALID_CREDENTIALS', 'Usuario o contrasena incorrectos', 401)
    }

    const accessToken = await createAccessToken({
      id: administrator.identificador,
      username: administrator.usuario,
    })

    return { accessToken, tokenType: 'Bearer', expiresIn: getConfig().JWT_EXPIRES_IN }
  }
}
