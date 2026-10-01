import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from './index.js'
import { getConfig } from './lib/config.js'

const config = getConfig()

serve({
  fetch: app.fetch,
  port: config.PORT,
})

console.log(`API ejecutandose en http://localhost:${config.PORT}`)
