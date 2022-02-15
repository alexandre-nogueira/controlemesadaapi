import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { UserService } from 'App/Services/UserService';

export default class UserValidation {
  public async handle(
    { params, auth }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (params.userId) {
      const authenticatedUser = await auth.authenticate();
      const userService = new UserService();
      if (!(await userService.isParent(authenticatedUser.id, params.userId))) {
        return;
      }
    }

    await next();
  }
}
