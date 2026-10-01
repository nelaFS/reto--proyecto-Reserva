import { getPool } from '../db/pool.js'
import type { Reserva, ReservaFilters, EstadoPedido } from '../types/domain.js'

export interface CreateReservaInput {
  nombreCliente: string
  numeroCliente: string
  estadoPedido: EstadoPedido
  numeroMesa: number
  cantidadPersonas: number
  fechaReserva?: string
}

export interface UpdateReservaInput {
  nombreCliente?: string
  numeroCliente?: string
  estadoPedido?: EstadoPedido
  numeroMesa?: number
  cantidadPersonas?: number
  fechaReserva?: string
}

export interface ReservaRepository {
  create(input: CreateReservaInput): Promise<Reserva>
  update(id: number, input: UpdateReservaInput): Promise<Reserva | null>
  findById(id: number): Promise<Reserva | null>
  list(filters: ReservaFilters): Promise<{ data: Reserva[]; total: number }>
  listAvailable(fechaReserva: string, cantidadPersonas: number): Promise<Array<{ identificador: number; numeroMesa: number; capacidad: number }>>
}

interface ReservaRow {
  identificador: number
  nombreCliente: string
  numeroCliente: string
  estadoPedido: EstadoPedido
  numeroMesa: number
  cantidadPersonas: number
  fechaReserva: string
}

function mapRow(row: ReservaRow): Reserva {
  return {
    identificador: row.identificador,
    nombreCliente: row.nombreCliente,
    numeroCliente: row.numeroCliente,
    estadoPedido: row.estadoPedido,
    numeroMesa: row.numeroMesa,
    cantidadPersonas: row.cantidadPersonas,
    fechaReserva: row.fechaReserva,
  }
}

export class PostgresReservaRepository implements ReservaRepository {
  async create(input: CreateReservaInput): Promise<Reserva> {
    const result = await getPool().query<{ identificador: number }>(
      `INSERT INTO tabla_reserva
       (nombre_cliente, numero_cliente, estado_pedido, numero_mesa, cantidad_personas, fecha_reserva)
       VALUES ($1, $2, $3, $4, $5, COALESCE($6::timestamp, CURRENT_TIMESTAMP))
       RETURNING identificador`,
      [
        input.nombreCliente,
        input.numeroCliente,
        input.estadoPedido,
        input.numeroMesa,
        input.cantidadPersonas,
        input.fechaReserva ?? null,
      ],
    )

    const created = await this.findById(result.rows[0].identificador)
    if (!created) throw new Error('No se pudo recuperar la reserva creada')
    return created
  }

  async update(id: number, input: UpdateReservaInput): Promise<Reserva | null> {
    const fields: string[] = []
    const values: Array<string | number | null> = []
    const updates: Array<[keyof UpdateReservaInput, string]> = [
      ['nombreCliente', 'nombre_cliente'],
      ['numeroCliente', 'numero_cliente'],
      ['estadoPedido', 'estado_pedido'],
      ['numeroMesa', 'numero_mesa'],
      ['cantidadPersonas', 'cantidad_personas'],
      ['fechaReserva', 'fecha_reserva'],
    ]

    for (const [key, column] of updates) {
      const value = input[key]
      if (value !== undefined) {
        fields.push(`${column} = $${values.length + 1}`)
        values.push(value)
      }
    }

    if (fields.length === 0) return this.findById(id)

    values.push(id)
    await getPool().query(
      `UPDATE tabla_reserva SET ${fields.join(', ')} WHERE identificador = $${values.length}`,
      values,
    )

    return this.findById(id)
  }

  async findById(id: number): Promise<Reserva | null> {
    const result = await getPool().query<ReservaRow>(
      `SELECT identificador, nombre_cliente AS "nombreCliente", numero_cliente AS "numeroCliente",
              estado_pedido AS "estadoPedido", numero_mesa AS "numeroMesa",
              cantidad_personas AS "cantidadPersonas", fecha_reserva AS "fechaReserva"
       FROM tabla_reserva
       WHERE identificador = $1
       LIMIT 1`,
      [id],
    )

    return result.rows[0] ? mapRow(result.rows[0]) : null
  }

  async list(filters: ReservaFilters): Promise<{ data: Reserva[]; total: number }> {
    const conditions: string[] = []
    const values: Array<string | number | null> = []

    if (filters.estado) {
      conditions.push(`estado_pedido = $${values.length + 1}`)
      values.push(filters.estado)
    }
    if (filters.fechaDesde) {
      conditions.push(`fecha_reserva >= $${values.length + 1}`)
      values.push(filters.fechaDesde)
    }
    if (filters.fechaHasta) {
      conditions.push(`fecha_reserva <= $${values.length + 1}`)
      values.push(filters.fechaHasta)
    }
    if (filters.numeroMesa !== undefined) {
      conditions.push(`numero_mesa = $${values.length + 1}`)
      values.push(filters.numeroMesa)
    }
    if (filters.nombreCliente) {
      conditions.push(`nombre_cliente ILIKE $${values.length + 1}`)
      values.push(`%${filters.nombreCliente}%`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const limitPosition = values.length + 1
    const offsetPosition = values.length + 2
    const offset = (filters.page - 1) * filters.limit
    const result = await getPool().query<ReservaRow>(
      `SELECT identificador, nombre_cliente AS "nombreCliente", numero_cliente AS "numeroCliente",
              estado_pedido AS "estadoPedido", numero_mesa AS "numeroMesa",
              cantidad_personas AS "cantidadPersonas", fecha_reserva AS "fechaReserva"
       FROM tabla_reserva
       ${where}
       ORDER BY fecha_reserva DESC, identificador DESC
       LIMIT $${limitPosition} OFFSET $${offsetPosition}`,
      [...values, filters.limit, offset],
    )
    const count = await getPool().query<{ total: string }>(
      `SELECT COUNT(*)::text AS total FROM tabla_reserva ${where}`,
      values,
    )

    return { data: result.rows.map(mapRow), total: Number(count.rows[0]?.total ?? 0) }
  }

  async listAvailable(fechaReserva: string, cantidadPersonas: number) {
    const result = await getPool().query<{ identificador: number; numeroMesa: number; capacidad: number }>(
      `SELECT m.identificador, m.numero_mesa AS "numeroMesa", m.capacidad
       FROM mesa m
       WHERE m.estado = 'Disponible'
         AND m.capacidad >= $1
         AND NOT EXISTS (
           SELECT 1 FROM tabla_reserva r
           WHERE r.numero_mesa = m.numero_mesa
             AND r.estado_pedido <> 'Cancelado'
             AND r.fecha_reserva = $2::timestamp
         )
       ORDER BY m.numero_mesa`,
      [cantidadPersonas, fechaReserva],
    )
    return result.rows
  }
}
