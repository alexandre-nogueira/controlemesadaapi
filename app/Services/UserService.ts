import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { RequestContract } from '@ioc:Adonis/Core/Request';
import User from 'App/Models/User';
import { AuthContract } from '@ioc:Adonis/Addons/Auth';

export class UserService{

  //Register
  public async register(newUser: User, auth: AuthContract){

    if (await newUser.save()){
      const token = await auth.use("api").login(newUser, {
          expiresIn: "1 days",
      });
      if (token){
        return {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          user_type: newUser.user_type,
          parent_user_id: newUser.parent_user_id,
          token: token.token
        };
      }
    }
  }

  //Login
  public async login(email: string, password: string, auth: AuthContract){
    const token = await auth.use("api").attempt(email, password, {
      expiresIn: "1 day",
    });
    const user = token.user;
    return {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              user_type: user.user_type,
              parent_user_id: user.parent_user_id,
              token: token.token
            };
  }

  //List all users
  public async list(user: User){
    return await User.all();
  }

  //list children users according to the parent id
  public async getChildren(user: User){
    return await User.query().where('parent_user_id', user.id);
  }

  public async getById(id: number){
    return await User.find(id);
  }

  //remove user
  public async delete(id: number){
    const user = await this.getById(id);
    if(user){
      if(user.delete()){
        return user;
      }
    }
  }

  //Logout


  //Get by email
  public async getByEmail(email: string){
    return await User.query().where('email', email).first();
  }

  //***** Validation Methods ******/
  //Validate email
  public async validateEmailNewUser(request: RequestContract){
    const authSchema = schema.create({
      email: schema.string({}, [
          rules.email(),
          rules.unique({
              table:'users',
              column: 'email',
          })
      ]),
    });
    const payload = await request.validate({ schema: authSchema });
    return payload.email;
  }

  public async validateEmailRegistered(request: RequestContract){
    const authSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
      ]),
    });
    const payload = await request.validate({ schema: authSchema });
    return payload.email;
  }

  //Validate password
  public async validatePassword(request: RequestContract){
    const authSchema = schema.create({
      password: schema.string({}, [
        rules.minLength(5),
      ]),
    });
    const payload = await request.validate({ schema: authSchema });
    return payload.password;
  }

  //Validate first name
  public async validateFirstName(request: RequestContract){
    const authSchema = schema.create({
      first_name: schema.string({}, [
        rules.minLength(2),
      ]),
    });
    const payload = await request.validate({ schema: authSchema });
    return payload.first_name;
  }

    //Validate last name
  public async validateLastName(request: RequestContract){
    const authSchema = schema.create({
      last_name: schema.string({}, [
        rules.minLength(2),
      ]),
    });
    const payload = await request.validate({ schema: authSchema });
    return payload.last_name;
  }

  //Validate user_type
  public async validateUserType(request: RequestContract){
    const authSchema = schema.create({
      user_type: schema.number([
        rules.range(1,2),
      ]),
    });
    const payload = await request.validate({ schema: authSchema });
    return payload.user_type;
  }

  //Validate parent_user_id
  public async validateParentUserId(request: RequestContract){
    const authSchema = schema.create({
      parent_user_id: schema.number.optional([
        rules.exists({
            table: 'users',
            column: 'id',
            where: {
                user_type: 1,
            },
        })
      ])
    });
    const payload = await request.validate({ schema: authSchema });
    return payload.parent_user_id;
  }
  //***** Validation Methods ******/
}
