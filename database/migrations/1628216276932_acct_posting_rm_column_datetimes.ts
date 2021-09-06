import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AcctPostingRmColumnDatetimes extends BaseSchema {
  protected tableName = 'acct_postings'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('date_time')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
