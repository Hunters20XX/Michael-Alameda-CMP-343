import dotenv from 'dotenv'
import pkg from 'pg'
const { Pool } = pkg

dotenv.config()

// Support either a single DATABASE_URL or individual PG_* env vars
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : undefined,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

async function query(text, params) {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.debug('executed query', { text, duration, rows: res.rowCount })
  return res
}

export { pool, query }
