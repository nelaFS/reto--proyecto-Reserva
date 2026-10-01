import { Pool } from 'pg'
import { getConfig } from '../lib/config.js'

let pool: Pool | undefined

export function getPool(): Pool {
  if (!pool) {
    const config = getConfig()
    pool = new Pool({
      connectionString: config.DATABASE_URL,
      max: config.DATABASE_CONNECTION_LIMIT,
      ssl: config.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
    })
  }
  return pool
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = undefined
  }
}
