import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AccountService } from 'App/Services/AccountService';

export default class AccountValidation {
  public async handle(
    { request, auth, response, params }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (request.input('accountId')) {
      response.status(400);
      response.send({ error: 'accountId must be a parameter' });
      return;
    }

    if (params.accountId) {
      const user = await auth.authenticate();
      const accountService = new AccountService(params.accountId, user.id);
      if (!(await accountService.isValid())) {
        response.status(401);
        response.send({ error: `Account ${params.accountId} is not valid` });
        return;
      }
    }

    await next();
  }
}
