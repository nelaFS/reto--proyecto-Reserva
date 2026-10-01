import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { getConfig } from './lib/config.js'
import { errorHandler } from './middleware/error-handler.js'
import { createAuthRoutes } from './routes/auth.routes.js'
import { createReservaRoutes } from './routes/reserva.routes.js'
import { createPublicRoutes } from './routes/public.routes.js'
import { createContentRoutes } from './routes/content.routes.js'

const app = new Hono()

app.onError(errorHandler)
app.use('*', async (c, next) => {
  const config = getConfig()
  const origins = config.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  return cors({ origin: origins })(c, next)
})

app.get('/health', (c) => c.json({ status: 'ok' }))
app.route('/api/auth', createAuthRoutes())
app.route('/api/reservas', createReservaRoutes())
app.route('/api/public', createPublicRoutes())
app.route('/api/mesas', createContentRoutes('mesas', true))
app.route('/api/menu', createContentRoutes('menu', true))
app.route('/api/eventos', createContentRoutes('eventos', true))
app.route('/api/promociones', createContentRoutes('promociones', true))

app.notFound((c) => c.json({
  error: {
    code: 'NOT_FOUND',
    message: 'Ruta no encontrada',
  },
}, 404))

export default app
