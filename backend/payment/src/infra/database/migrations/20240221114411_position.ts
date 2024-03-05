import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('position', (table) => {
    table.uuid('position_id').primary()
    table.uuid('ride_id').references('ride_id').inTable('ride')
    table.float('lat', 17, 15)
    table.float('long', 17, 15)
    table.dateTime('date')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('position')
}
