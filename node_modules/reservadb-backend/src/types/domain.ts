export type EstadoPedido = 'Disponible' | 'Cancelado'

export interface Administrador {
  identificador: number
  usuario: string
  contrasena: string
}

export interface Reserva {
  identificador: number
  nombreCliente: string
  numeroCliente: string
  estadoPedido: EstadoPedido
  numeroMesa: number
  cantidadPersonas: number
  fechaReserva: string
}

export interface ReservaFilters {
  estado?: EstadoPedido
  fechaDesde?: string
  fechaHasta?: string
  numeroMesa?: number
  nombreCliente?: string
  page: number
  limit: number
}
