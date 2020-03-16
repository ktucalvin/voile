'use strict'
const mysql = require('promise-mysql')
let pool

async function initDatabase (dbOptions) {
  console.log(`Creating database pool for ${process.env.DB_NAME}...`)
  pool = await mysql.createPool(dbOptions)
  console.log('Pool initialized')
}

function getDatabasePool () {
  if (!pool) {
    throw new Error('Database pool was not initialized before accessing')
  }
  return pool
}

module.exports = { initDatabase, getDatabasePool }
