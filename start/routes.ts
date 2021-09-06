/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//Register and login, methods that doesnt need token
Route.group(() => {
  Route.post("register", "UserController.register");
  Route.post("login", "UserController.login");
  Route.get("exists/:email", "UserController.exists");
}).prefix("api");

//Logout
Route.group(() => {
   Route.get('logout', 'UserController.logout')
}).prefix('api').middleware("auth:api");

//Users
Route.group(() => {
  Route.get('users/index', 'UserController.index')
  Route.get('users/listchildren/', 'UserController.listChildren')
  Route.get('users/getParent/', 'UserController.getParent')
  Route.delete('users/:id', 'UserController.destroy')
  Route.get('users/logout', 'UserController.logout')
}).middleware("auth:api");

//Accounts
Route.group(() => {
  Route.get('accounts', 'AccountsController.index')
  Route.get('accounts/:accountId', 'AccountsController.show')
  Route.post('accounts', 'AccountsController.store')
  Route.patch('accounts/:accountId', 'AccountsController.update')
  Route.delete('accounts/:accountId', 'AccountsController.destroy')
}).middleware('auth:api').middleware('accountValidation');

//Account Postings
Route.group(() => {
    Route.get('accountPostings/search/:accountId', 'AccountPostingsController.search')
    Route.post('accountPostings/:accountId', 'AccountPostingsController.store')
    Route.get('accountPostings/:accountId/:postindId', 'AccountPostingsController.show')
    Route.delete('accountPostings/:accountId/:postindId', 'AccountPostingsController.destroy')
    Route.patch('accountPostings/:accountId/:postingId', 'AccountPostingsController.update')
}).middleware("auth:api").middleware('accountValidation');
