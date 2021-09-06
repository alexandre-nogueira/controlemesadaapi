import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AccountChangeColumnDescs extends BaseSchema {
  protected tableName = 'accounts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('descriptiion', 'description')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
