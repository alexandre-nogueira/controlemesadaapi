import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { UserService } from 'App/Services/UserService';

export default class UserController {
  //Login
  public async login({ request, auth }: HttpContextContract) {
    const userService = new UserService();
    const email = await userService.validateEmailRegistered(request);
    const password = await userService.validatePassword(request);

    return await userService.login(email, password, auth);
  }

  //Register new User
  public async register({ request, auth }: HttpContextContract) {
    const userService = new UserService();
    const newUser = new User();

    //Validate fields
    newUser.email = await userService.validateEmailNewUser(request);
    newUser.password = await userService.validatePassword(request);
    newUser.first_name = await userService.validateFirstName(request);
    newUser.last_name = await userService.validateLastName(request);
    newUser.user_type = await userService.validateUserType(request);
    newUser.parent_user_id = await userService.validateParentUserId(request);

    //Create new user and return data
    return await userService.register(newUser, auth);
  }

  //List all users
  public async index({ response, auth }: HttpContextContract) {
    const user = await auth.authenticate();
    const userService = new UserService();

    const users = await userService.list(user);
    if (users.length) {
      return users;
    } else {
      response.status(204);
    }
  }

  //list children users according to the parent id
  public async listChildren({ auth, response }: HttpContextContract) {
    const userService = new UserService();
    const user = await auth.authenticate();

    const users = await userService.getChildren(user);
    if (users.length) {
      return users;
    } else {
      response.status(204);
    }
  }

  //get parent data from a children user id
  public async getParent({ auth, response }: HttpContextContract) {
    const userService = new UserService();
    const user = await auth.authenticate();

    if (user.parent_user_id) {
      const parentUser = await userService.getById(user.parent_user_id);
      if (parentUser) {
        return parentUser;
      }
    }
    response.status(204);
  }

  //remove user
  public async destroy({ response, params }: HttpContextContract) {
    const userService = new UserService();

    const userDeleted = await userService.delete(params.userId);
    if (userDeleted) {
      return userDeleted;
    }
    response.status(500);
  }

  //logout user
  public async logout({ auth }: HttpContextContract) {
    return await auth.logout();
  }

  //check if user already exists
  public async exists({ params }: HttpContextContract) {
    const userService = new UserService();
    // return ({'exists' : !!(await userService.getByEmail(params.email))});
    return !!(await userService.getByEmail(params.email));
  }

  public async getSingle({ params }: HttpContextContract) {
    const userService = new UserService();
    return await userService.getById(params.userId);
  }
}
