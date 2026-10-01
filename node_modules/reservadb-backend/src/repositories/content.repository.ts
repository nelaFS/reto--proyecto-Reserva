import { getPool } from '../db/pool.js'

export type ContentResource = 'mesas' | 'menu' | 'eventos' | 'promociones'

interface ContentRow { [key: string]: unknown }
interface ResourceConfig { table: string; columns: string[]; select: string }

const resourceConfig: Record<ContentResource, ResourceConfig> = {
  mesas: { table: 'mesa', columns: ['numero_mesa', 'capacidad', 'estado'], select: 'identificador, numero_mesa AS "numeroMesa", capacidad, estado' },
  menu: { table: 'plato', columns: ['nombre', 'descripcion', 'imagen', 'precio', 'categoria', 'disponible'], select: 'identificador, nombre, descripcion, imagen, precio, categoria, disponible' },
  eventos: { table: 'evento', columns: ['nombre', 'descripcion', 'imagen', 'fecha', 'hora', 'estado'], select: 'identificador, nombre, descripcion, imagen, fecha, hora, estado' },
  promociones: { table: 'promocion', columns: ['titulo', 'descripcion', 'imagen', 'descuento', 'fecha_inicio', 'fecha_fin', 'estado'], select: 'identificador, titulo, descripcion, imagen, descuento, fecha_inicio AS "fechaInicio", fecha_fin AS "fechaFin", estado' },
}

export class ContentRepository {
  async list(resource: ContentResource): Promise<ContentRow[]> {
    const config = resourceConfig[resource]
    const result = await getPool().query<ContentRow>(`SELECT ${config.select} FROM ${config.table} ORDER BY identificador DESC`)
    return result.rows
  }

  async create(resource: ContentResource, input: Record<string, unknown>): Promise<ContentRow | null> {
    const config = resourceConfig[resource]
    const keys = Object.keys(input)
    const columns = keys.map((key) => this.columnFor(key, config.columns))
    const values = keys.map((key) => input[key])
    const result = await getPool().query<{ identificador: number }>(
      `INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING identificador`,
      values,
    )
    const rows = await this.find(resource, result.rows[0].identificador)
    return rows[0] ?? null
  }

  async update(resource: ContentResource, id: number, input: Record<string, unknown>): Promise<ContentRow | null> {
    const config = resourceConfig[resource]
    const keys = Object.keys(input)
    const columns = keys.map((key) => this.columnFor(key, config.columns))
    if (!columns.length) return (await this.find(resource, id))[0] ?? null
    const values = keys.map((key) => input[key])
    await getPool().query(
      `UPDATE ${config.table} SET ${columns.map((column, index) => `${column} = $${index + 1}`).join(', ')} WHERE identificador = $${values.length + 1}`,
      [...values, id],
    )
    return (await this.find(resource, id))[0] ?? null
  }

  async remove(resource: ContentResource, id: number): Promise<void> {
    await getPool().query(`DELETE FROM ${resourceConfig[resource].table} WHERE identificador = $1`, [id])
  }

  private async find(resource: ContentResource, id: number): Promise<ContentRow[]> {
    const config = resourceConfig[resource]
    const result = await getPool().query<ContentRow>(`SELECT ${config.select} FROM ${config.table} WHERE identificador = $1`, [id])
    return result.rows
  }

  private columnFor(key: string, allowed: string[]): string {
    const mapping: Record<string, string> = {
      numeroMesa: 'numero_mesa', capacidad: 'capacidad', estado: 'estado', nombre: 'nombre', descripcion: 'descripcion',
      imagen: 'imagen', precio: 'precio', categoria: 'categoria', disponible: 'disponible', fecha: 'fecha', hora: 'hora',
      titulo: 'titulo', descuento: 'descuento', fechaInicio: 'fecha_inicio', fechaFin: 'fecha_fin',
    }
    const column = mapping[key]
    if (!column || !allowed.includes(column)) throw new Error(`Campo no permitido: ${key}`)
    return column
  }
}
