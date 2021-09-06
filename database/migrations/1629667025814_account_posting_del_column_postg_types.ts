import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccountPostingDelColumnPostgTypes extends BaseSchema {
  protected tableName = 'account_postings'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('posting_type')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
