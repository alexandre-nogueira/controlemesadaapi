import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo
} from '@ioc:Adonis/Lucid/Orm'
import Account from './Account'

export default class AccountPosting extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public account_id: number

  @belongsTo(() => Account, {
    foreignKey: 'account_id'
  })
  public account: BelongsTo<typeof Account>

  @column()
  public value: number;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
