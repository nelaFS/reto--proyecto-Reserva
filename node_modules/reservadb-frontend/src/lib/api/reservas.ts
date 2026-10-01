import { request } from './client'
import type { Reserva, ReservaFilters, ReservaInput, ReservaListResponse } from '../../types/api'

function queryString(filters: ReservaFilters): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }
  const result = query.toString()
  return result ? `?${result}` : ''
}

export function listReservas(filters: ReservaFilters = {}): Promise<ReservaListResponse> {
  return request<ReservaListResponse>(`/api/reservas${queryString(filters)}`)
}

export function createReserva(input: ReservaInput): Promise<{ data: Reserva }> {
  return request('/api/reservas', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateReserva(id: number, input: Partial<ReservaInput>): Promise<{ data: Reserva }> {
  return request(`/api/reservas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}
