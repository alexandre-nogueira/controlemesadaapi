import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ChangePostDateToTimestamps extends BaseSchema {
  protected tableName = 'account_postings';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('posting_date');
    });
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('posting_date');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
