import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccountPostingRenameTables extends BaseSchema {
  protected tableName = 'acct_postings'

  public async up () {
    this.schema.renameTable('acct_postings', 'account_postings');
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
