import { getPool } from '../db/pool.js'
import type { Administrador } from '../types/domain.js'

export interface AdministradorRepository {
  findByUsuario(usuario: string): Promise<Administrador | null>
}

interface AdministradorRow {
  identificador: number
  usuario: string
  contrasena: string
}

export class PostgresAdministradorRepository implements AdministradorRepository {
  async findByUsuario(usuario: string): Promise<Administrador | null> {
    const result = await getPool().query<AdministradorRow>(
      `SELECT identificador, usuario, contrasena
       FROM administrador
       WHERE usuario = $1
       LIMIT 1`,
      [usuario],
    )

    const row = result.rows[0]
    if (!row) return null

    return {
      identificador: row.identificador,
      usuario: row.usuario,
      contrasena: row.contrasena,
    }
  }
}
