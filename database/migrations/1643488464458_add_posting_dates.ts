import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddPostingDates extends BaseSchema {
  protected tableName = 'account_postings';

  public async up() {
    this.schema.alterTable(this.tableName, (table) =>
      table.dateTime('posting_date')
    );
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
