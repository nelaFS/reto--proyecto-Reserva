import { request } from './client'
import type { LoginResponse } from '../../types/api'

export function login(usuario: string, contrasena: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, contrasena }),
  })
}

export function logout(): Promise<{ data: { message: string } }> {
  return request('/api/auth/logout', { method: 'POST' })
}
