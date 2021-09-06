import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccountPostingRenameColumnAcctIds extends BaseSchema {
  protected tableName = 'account_postings'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('acct_id', 'account_id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
