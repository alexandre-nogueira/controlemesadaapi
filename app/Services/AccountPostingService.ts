import AccountPosting from 'App/Models/AccountPosting';
import { DateTime } from 'luxon';
import { AccountService } from './AccountService';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

export class AccountPostingService {
  private _accountId: number;

  constructor(accountId?: number) {
    if (accountId) {
      this._accountId = accountId;
    }
  }

  //Validate value
  public async validateValue(request: RequestContract) {
    //Create schemma to validate account
    const accountSchema = schema.create({
      value: schema.number([rules.required()]),
    });
    //Validate request vs schema
    const payload = await request.validate({ schema: accountSchema });
    return payload.value;
  }

  //VAlidate posting date
  public async validateDate(request: RequestContract): Promise<DateTime> {
    //Create schema to validate date
    const accountSchema = schema.create({
      postingDate: schema.date(),
    });
    const payload = await request.validate({ schema: accountSchema });
    return payload.postingDate;
  }

  public async validateDateFrom(request: RequestContract): Promise<DateTime> {
    //Create schema to validate date
    const accountSchema = schema.create({
      dateFrom: schema.date(),
    });
    const payload = await request.validate({ schema: accountSchema });
    return payload.dateFrom;
  }

  public async validateDateTo(request: RequestContract): Promise<DateTime> {
    //Create schema to validate date
    const accountSchema = schema.create({
      dateTo: schema.date(),
    });
    const payload = await request.validate({ schema: accountSchema });
    return payload.dateTo;
  }

  //Validate description
  public async validateDescription(request: RequestContract): Promise<string> {
    //Create schemma to validate account
    const accountSchema = schema.create({
      description: schema.string({}, [rules.minLength(5)]),
    });
    //Validate request vs schema
    const payload = await request.validate({ schema: accountSchema });
    return payload.description;
  }

  //Create new account posting
  public async create(
    value: number,
    description: string,
    postingDate: DateTime
  ) {
    const newAccountPosting = new AccountPosting();
    const accountService = new AccountService();
    newAccountPosting.account_id = this._accountId;
    newAccountPosting.value = value;
    newAccountPosting.description = description;
    newAccountPosting.postingDate = postingDate.toSQLDate();

    if (await newAccountPosting.save()) {
      if (!(await accountService.updateBallance(this._accountId, value))) {
        this.delete(newAccountPosting.id);
      }
      return newAccountPosting;
    }
  }

  //Get account postings
  public async getMany(dateFrom: DateTime, dateTo: DateTime) {
    return await AccountPosting.query()
      .where('account_id', this._accountId)
      .andWhere('posting_date', '>=', dateFrom.toSQLDate())
      .andWhere('posting_date', '<=', dateTo.toSQLDate());
  }

  //Get single account posting
  public async getSingle(id: number) {
    return await AccountPosting.query()
      .where('id', id)
      .andWhere('account_id', this._accountId)
      .first();
  }

  //Reverse account posting
  public async reverse(id: number) {
    const accountService = new AccountService();
    const accountPosting = await this.getSingle(id);
    if (accountPosting) {
      if (
        await accountService.updateBallance(
          accountPosting.account_id,
          accountPosting.value * -1
        )
      ) {
        if (await this.delete(id)) {
          return accountPosting;
        } else {
          accountService.updateBallance(
            accountPosting.account_id,
            accountPosting.value
          );
        }
      }
    }
  }

  //Delete account posting
  public async delete(id: number) {
    const accountPosting = await this.getSingle(id);
    if (accountPosting) {
      await accountPosting.delete();
      return accountPosting;
    }
  }

  public async updatePosting(
    id: number,
    value: number,
    description: string,
    postingDate: DateTime
  ) {
    const accountService = new AccountService();
    const accountPosting = await this.getSingle(id);
    let changed = false;

    if (accountPosting) {
      if (accountPosting.value !== value) {
        changed = true;
        if (
          !(await accountService.updateBallance(
            this._accountId,
            value - accountPosting.value
          ))
        ) {
          return;
        }
        accountPosting.value = value;
      }
      if (accountPosting.description !== description) {
        changed = true;
        accountPosting.description = description;
      }
      if (accountPosting.postingDate !== postingDate.toSQLDate()) {
        changed = true;
        accountPosting.postingDate = postingDate.toSQLDate();
      }

      if (changed) {
        if (await accountPosting.save()) {
          return accountPosting;
        }
      }
    }
  }
}
