import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'transaction',
    (table: Knex.CreateTableBuilder) => {
      table.uuid('transaction_id').primary()
      table.uuid('ride_id')
      table.float('amount', 15, 2)
      table.dateTime('date')
      table.string('status', 100)
    },
  )
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('transaction')
}
