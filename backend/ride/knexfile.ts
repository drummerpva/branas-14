import 'dotenv/config'

export default {
  client: 'mysql2',
  connection: {
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABAASE_HOST,
    debug: process.env.NODE_ENV === 'development' ? ['ComQueryPacket'] : null,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/infra/database/migrations',
  },
}
