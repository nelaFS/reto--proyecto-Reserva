const TOKEN_KEY = 'reservadb.accessToken'
const USER_KEY = 'reservadb.authenticatedUser'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function saveSession(accessToken: string, username: string): void {
  window.localStorage.setItem(TOKEN_KEY, accessToken)
  window.localStorage.setItem(USER_KEY, username)
}

export function getSessionUsername(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(USER_KEY)
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}
