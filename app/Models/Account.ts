import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import AccountPosting from './AccountPosting'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @belongsTo(() => User, {
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @column()
  public description: string

  @column()
  public acct_type: number

  @column()
  ballance: number

  @hasMany(() => AccountPosting, {
    foreignKey: 'account_id',
  })
  public accountPostings: HasMany<typeof AccountPosting>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
