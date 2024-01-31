import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'account',
    (table: Knex.CreateTableBuilder) => {
      table.uuid('account_id').primary().notNullable()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('cpf').notNullable()
      table.string('car_plate')
      table.boolean('is_passenger').notNullable().defaultTo(false)
      table.boolean('is_driver').notNullable().defaultTo(false)
    },
  )
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('account')
}
