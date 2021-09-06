import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AcctPostings extends BaseSchema {
  protected tableName = 'acct_postings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('acct_id')
        .unsigned()
        .references('accounts.id')
      table.float('value').notNullable()
      table.dateTime('date_time').notNullable()
      table.string('description', 255).notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
