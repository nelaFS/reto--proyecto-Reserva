import { jwt } from 'hono/jwt'
import type { MiddlewareHandler } from 'hono'
import { getConfig } from '../lib/config.js'

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const config = getConfig()
  const jwtMiddleware = jwt({
    secret: config.JWT_SECRET,
    alg: 'HS256',
    verification: {
      iss: config.JWT_ISSUER,
      aud: config.JWT_AUDIENCE,
      exp: true,
    },
  })

  return jwtMiddleware(c, next)
}
