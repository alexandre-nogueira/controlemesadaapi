import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AcctPostingAddColumnPostingTypes extends BaseSchema {
  protected tableName = 'acct_postings';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('posting_type');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
