import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AccountService } from 'App/Services/AccountService';

export default class AccountsController {
  //Return list of accounts from the authenticated user.
  public async index({ auth, response }: HttpContextContract) {
    const user = await auth.authenticate();
    const accountService = new AccountService();

    const userAccounts = await accountService.getMany(user.id);
    if (userAccounts.length) {
      return userAccounts;
    } else {
      response.status(404);
      return { error: `User ${user.email} has no accounts` };
    }
  }

  //Return list of accounts from the authenticated user.
  public async listUserAccounts({
    auth,
    response,
    params,
  }: HttpContextContract) {
    const user = await auth.authenticate();
    const accountService = new AccountService();
    const userId = params.userId;

    //Pending:
    //falta implementar a verificação se o userId realmente é filho do user autenticado.

    const userAccounts = await accountService.getMany(userId);
    if (userAccounts.length) {
      return userAccounts;
    } else {
      response.status(404);
      return { error: `User ${user.email} has no accounts` };
    }
  }

  //Get single account data
  public async show({ auth, response, params }: HttpContextContract) {
    const user = await auth.authenticate();
    const accountService = new AccountService(params.accountId, user.id);

    const account = await accountService.getSingle(params.accountId);

    if (account) {
      return account;
    } else {
      response.status(404);
      return { error: `Account ${params.accountId} not found` };
    }
  }

  //Create new account
  public async store({ request, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const accountService = new AccountService();

    const description = await accountService.validateDescription(request);
    const accountType = await accountService.validateAccountType(request);
    const userId = request.input('user_id');
    console.log(userId);
    return await accountService.create(
      userId,
      description,
      parseInt(accountType.toString()),
      0
    );
  }

  //Update account data
  public async update({ request, params, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const accountService = new AccountService(params.accountId, user.id);

    //Validate body parameters
    const description = await accountService.validateDescription(request);

    return await accountService.update(params.accountId, description);
  }

  //Delete account
  public async destroy({ params, response, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const accountService = new AccountService(params.accountId, user.id);

    try {
      return await accountService.delete(params.accountId);
    } catch (error) {
      response.status(404);
      return { error: `Account ${params.accountId} not found` };
    }
  }
}
