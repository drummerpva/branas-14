import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'ride_projection',
    (table: Knex.CreateTableBuilder) => {
      table.uuid('ride_id').primary()
      table.uuid('passenger_id').references('account_id').inTable('account')
      table.uuid('driver_id').references('account_id').inTable('account')
      table.float('fare', 15, 3)
      table.float('distance', 15, 3)
      table.string('status')
      table.string('passenger_name')
      table.string('passenger_cpf')
      table.string('driver_name')
      table.string('driver_cpf')
      table.string('driver_car_plate')
    },
  )
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('ride_projection')
}
