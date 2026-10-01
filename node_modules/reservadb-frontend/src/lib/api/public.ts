import { request } from './client'
import type { Reserva, ReservaInput } from '../../types/api'

export interface MesaDisponible {
  identificador: number
  numeroMesa: number
  capacidad: number
}

export interface PublicContent {
  data: Array<Record<string, unknown>>
}

export function getAvailableTables(fechaReserva: string, cantidadPersonas: number): Promise<{ data: MesaDisponible[] }> {
  const query = new URLSearchParams({ fechaReserva, cantidadPersonas: String(cantidadPersonas) })
  return request(`/api/public/mesas/disponibles?${query}`)
}

export function createPublicReservation(input: ReservaInput): Promise<{ data: Reserva }> {
  return request('/api/public/reservas', { method: 'POST', body: JSON.stringify(input) })
}

export function getPublicContent(resource: 'menu' | 'eventos' | 'promociones'): Promise<PublicContent> {
  return request(`/api/public/${resource}`)
}
