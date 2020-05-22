import 'dotenv/config'
import { createConnection, getConnection } from 'typeorm'
import dbConfig from '../../../ormconfig'

export async function createTestDatabase () {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: dbConfig.entities,
    synchronize: true,
    logging: false
  })
}

export async function dropDatabaseChanges () {
  await getConnection().close()
}
