import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url().default('postgresql://postgres:postgres@localhost:5432/reservadb'),
  DATABASE_SSL: z.preprocess(
    (value) => typeof value === 'string' ? value.trim().toLowerCase() : value,
    z.enum(['true', 'false']).default('false'),
  ).transform((value) => value === 'true'),
  DATABASE_CONNECTION_LIMIT: z.coerce.number().int().positive().default(10),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_ISSUER: z.string().default('reservadb-api'),
  JWT_AUDIENCE: z.string().default('reservadb-client'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN debe tener al menos un origen permitido'),
})

export type AppConfig = z.infer<typeof environmentSchema>

let cachedConfig: AppConfig | undefined

export function getConfig(): AppConfig {
  if (!cachedConfig) {
    const result = environmentSchema.safeParse(process.env)
    if (!result.success) {
      throw new Error(`Configuracion invalida: ${result.error.message}`)
    }
    cachedConfig = result.data
  }
  return cachedConfig
}

export function resetConfigForTests(): void {
  cachedConfig = undefined
}
