import 'dotenv/config'
import { createConnection, getConnection } from 'typeorm'

export async function createTestDatabase () {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ['./src/server/models/*.ts'],
    synchronize: true,
    logging: false
  })
}

export async function dropDatabaseChanges () {
  await getConnection().close()
}
