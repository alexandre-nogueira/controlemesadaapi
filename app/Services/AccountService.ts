import Account from 'App/Models/Account'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { AccountTypes } from 'App/Models/AccountType'
import { RequestContract } from '@ioc:Adonis/Core/Request';
import User from 'App/Models/User';

export class AccountService {

  _accountId: number;
  _userId: number;
  _isValid: boolean;

  constructor(accountId?: number, userId?: number){
    if (accountId && userId){
      this._accountId = accountId;
      this._userId = userId;
    }
  }

  public async updateBallance(id: number, value: number){

    const account = await Account.findOrFail(id);

    account.ballance += +value;
    return !!account.save();
  }

  public async validateDescription(request: RequestContract){
        //Create schemma to validate account
        const accountSchema = schema.create({
          description: schema.string({}, [
            rules.minLength(5),
          ]),
        });

        //Validate request vs schema
        const payload =  await request.validate({ schema: accountSchema });
        return payload.description;
        //validate optional fields
  }

  public async validateAccountType(request: RequestContract){
    //Create schemma to validate account
    const accountSchema = schema.create({
          acct_type:
            schema.enum(Object.values(AccountTypes)),
    })

    //Validate request vs schema
    const payload =  await request.validate({ schema: accountSchema });
    return payload.acct_type;
    //validate optional fields
  }

  public async create(user_id: number,
                      description: string,
                      acct_Type: number,
                      ballance: number){

    const newAccount = new Account();
    newAccount.user_id = user_id;
    newAccount.description = description;
    newAccount.acct_type = acct_Type;
    newAccount.ballance = ballance;

    //save new account in database
    await newAccount.save();
    return newAccount;
  }


  public async update(id: number, description: string){

    const account = await Account.findOrFail(id);

    account.description = description;
    if (account.save()){
      return account;
    }
  }

  public async delete(id: number){

    const account = await Account.findOrFail(id);;

      if (account.delete()){
        return account;
      }
  }

  public async getMany(user: User){

    return await Account
    .query()
    .where('user_id', user.id);

  }

  public async getSingle(id: number){
    return await Account.find(id);
  }

  private async isAccountOwner(){
    if (this._accountId && this._userId){
      const account = await this.getSingle(this._accountId);
      if(account){
        return account.user_id == this._userId;
      }
    }
    return false
  }

  public async isValid(){

    if (this._isValid == null){
      this._isValid = true;

      //VALIDATIONS
      ////validate if the user is the account owner
      if(!(await this.isAccountOwner())){
        return this._isValid = false;
      }
      ////Other Validations
      ///....
    }else{
      this._isValid;
    }
    return this._isValid;
  }

}
