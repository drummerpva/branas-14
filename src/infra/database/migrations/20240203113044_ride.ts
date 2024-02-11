import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ride', (table: Knex.CreateTableBuilder) => {
    table.uuid('ride_id').primary().notNullable()
    table.uuid('passenger_id').references('account_id').inTable('account')
    table.uuid('driver_id').references('account_id').inTable('account')
    table.string('status')
    table.dateTime('date')
    table.float('fare', 15, 3)
    table.float('distance', 15, 3)
    table.float('from_lat', 17, 15)
    table.float('from_long', 17, 15)
    table.float('to_lat', 17, 15)
    table.float('to_long', 17, 15)
    table.timestamp('started_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ride')
}
