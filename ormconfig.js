require('dotenv').config()

const entities = (
  typeof process[Symbol.for('ts-node.register.instance')] === 'object' ||
  process.env.NODE_ENV === 'test' ||
  process.env.NODE_ENV === 'development'
)
  ? ['./src/server/models/*.ts']
  : ['./dist/server/models/*.js']

module.exports = {
  name: 'default',
  type: 'mysql',
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: 'false',
  entities
}
