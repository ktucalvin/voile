import 'dotenv/config'
import { createConnection, getConnection } from 'typeorm'

export async function createTestDatabase () {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [process.env.TYPEORM_ENTITIES],
    synchronize: true,
    logging: false
  })
}

export async function dropDatabaseChanges () {
  await getConnection().close()
}
