export type EstadoPedido = 'Disponible' | 'Cancelado'

export interface ApiErrorBody {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

export interface LoginResponse {
  data: {
    accessToken: string
    tokenType: 'Bearer'
    expiresIn: string
  }
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

export interface ReservaListResponse {
  data: Reserva[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ReservaInput {
  nombreCliente: string
  numeroCliente: string
  estadoPedido: EstadoPedido
  numeroMesa: number
  cantidadPersonas: number
  fechaReserva?: string
}

export interface ReservaFilters {
  estado?: EstadoPedido
  fechaDesde?: string
  fechaHasta?: string
  numeroMesa?: number
  nombreCliente?: string
  page?: number
  limit?: number
}
