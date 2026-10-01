import { sign } from 'hono/jwt'
import { getConfig } from './config.js'

export interface AuthTokenPayload extends Record<string, unknown> {
  sub: string
  username: string
  iss: string
  aud: string
  iat: number
  exp: number
}

const durationPattern = /^(\d+)([smhd])$/

function expirationInSeconds(value: string): number {
  const match = value.match(durationPattern)
  if (!match) return 3600

  const amount = Number(match[1])
  const multiplier = { s: 1, m: 60, h: 3600, d: 86400 }[match[2] as 's' | 'm' | 'h' | 'd']
  return amount * multiplier
}

export async function createAccessToken(input: { id: number; username: string }): Promise<string> {
  const config = getConfig()
  const now = Math.floor(Date.now() / 1000)

  const payload: AuthTokenPayload = {
    sub: String(input.id),
    username: input.username,
    iss: config.JWT_ISSUER,
    aud: config.JWT_AUDIENCE,
    iat: now,
    exp: now + expirationInSeconds(config.JWT_EXPIRES_IN),
  }

  return sign(payload, config.JWT_SECRET, 'HS256')
}
