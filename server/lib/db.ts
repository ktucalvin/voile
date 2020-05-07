import mysql, { Pool } from 'promise-mysql'
let pool: Pool

const defaultOptions = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}

async function initDatabase (dbOptions?): Promise<void> {
  console.log(`Creating database pool for ${process.env.DB_NAME}...`)
  try {
    pool = await mysql.createPool(dbOptions || defaultOptions)
    console.log('Pool initialized')
  } catch (e) {
    console.log('Failed to create database pool. Stack trace:')
    console.log(e)
  }
}

function getDatabasePool (): Pool {
  if (!pool) {
    console.log('[WARNING] Database pool was not initialized before accessing. Initializing using default options.')
    initDatabase(defaultOptions)
  }
  return pool
}

export { initDatabase, getDatabasePool }
