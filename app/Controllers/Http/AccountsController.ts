import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AccountService } from 'App/Services/AccountService';

export default class AccountsController {

    //Return list of accounts from the authenticated user.
    public async index({ auth, response }: HttpContextContract){
        const user = await auth.authenticate();
        const accountService = new AccountService();

        const userAccounts = await accountService.getMany(user);
        if (userAccounts.length){
          return userAccounts;
        }else{
          response.status(404);
          return { error: `User ${user.email} has no accounts`};
        }
    }

    //Get single account data
    public async show({ auth, response, params}: HttpContextContract){
      const user = await auth.authenticate();
      const accountService = new AccountService(params.accountId, user.id);

      const account = await accountService.getSingle(params.accountId);

      if(account){
        return account;
      }else{
        response.status(404);
        return { error: `Account ${params.accountId} not fount`};
      }
    }

    //Create new account
    public async store({ request, auth }: HttpContextContract){
        const user = await auth.authenticate();
        const accountService = new AccountService();

        const description = await accountService.validateDescription(request);
        const accountType = await accountService.validateAccountType(request);

        return await accountService.create(
          user.id,
          description,
          parseInt(accountType.toString()),
          0
        );
    }

    //Update account data
    public async update({ request, params, auth }: HttpContextContract){
      const user = await auth.authenticate();
      const accountService = new AccountService(params.accountId, user.id);

      //Validate body parameters
      const description = await accountService.validateDescription(request);

      return await accountService.update(params.accountId, description);
    }

    //Delete account
    public async destroy({ params, response, auth }: HttpContextContract){

      const user = await auth.authenticate();
      const accountService = new AccountService(params.accountId, user.id);

      try {
        return await accountService.delete(params.accountId)
      } catch (error) {
        response.status(404);
        return { error: `Account ${params.accountId} not found`};
      }

     }

}


