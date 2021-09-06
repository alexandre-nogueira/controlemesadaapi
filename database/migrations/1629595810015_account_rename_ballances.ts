import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccountRenameBallances extends BaseSchema {
  protected tableName = 'accounts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('balance', 'ballance')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
