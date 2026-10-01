import { clearSession, getAccessToken } from '../session'
import type { ApiErrorBody } from '../../types/api'

const apiUrl = (import.meta.env.PUBLIC_API_URL ?? '/').replace(/\/$/, '')

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${apiUrl}${path}`, { ...options, headers })
  } catch {
    throw new ApiClientError('No se pudo conectar con el servidor.', 0, 'NETWORK_ERROR')
  }

  if (response.status === 401) {
    clearSession()
    if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/login')) {
      window.location.href = '/login'
    }
  }

  const body = await response.json().catch(() => null) as ApiErrorBody | T | null
  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null
    throw new ApiClientError(
      errorBody?.error?.message ?? 'La solicitud no pudo completarse.',
      response.status,
      errorBody?.error?.code,
    )
  }

  return body as T
}
