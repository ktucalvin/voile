'use strict'
const mysql = require('promise-mysql')
let pool

async function initDatabase (dbOptions) {
  console.log(`Creating database pool for ${process.env.DB_NAME}...`)
  try {
    pool = await mysql.createPool(dbOptions)
    console.log('Pool initialized')
  } catch (e) {
    console.log('Failed to create database pool. Stack trace:')
    console.log(e)
  }
}

function getDatabasePool () {
  if (!pool) {
    throw new Error('Database pool was not initialized before accessing')
  }
  return pool
}

module.exports = { initDatabase, getDatabasePool }
