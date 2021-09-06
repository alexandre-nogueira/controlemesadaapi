import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AccountPostingService } from 'App/Services/AccountPostingService';
import { DateTime } from 'luxon';

export default class AcctPostingsController {
  //Search postings by date
  public async search({ response, request, params }: HttpContextContract) {
    const accountPostingService = new AccountPostingService(params.accountId);

    // //get query string data
    // const { dateFrom, dateTo } = request.qs();
    // if (!dateTo || !dateFrom){
    //   response.status(400);
    //   return {error: 'Query strings dateFrom and dateTo are mandatory'};
    // }

    // //Convert QS data to DateTime format
    // const dateFromSQL: DateTime = DateTime.fromISO(dateFrom);
    // const dateToSQL: DateTime = DateTime.fromISO(dateTo);

    const dateFromSQL: DateTime = DateTime.fromISO('2021-01-01');
    const dateToSQL: DateTime = DateTime.fromISO('2022-01-01');

    //get account posgings
    const accountPostings = await accountPostingService.getMany(
      dateFromSQL,
      dateToSQL
    );
    if (accountPostings.length) {
      return accountPostings;
    } else {
      response.status(204);
    }
  }

  //Save New Posting
  public async store({ params, request, response }: HttpContextContract) {
    const accountPostingService = new AccountPostingService(params.accountId);

    const value = await accountPostingService.validateValue(request);
    const description = await accountPostingService.validateDescription(
      request
    );

    const accountPosting = await accountPostingService.create(
      value,
      description
    );

    if (!accountPosting) {
      response.status(400);
      return { error: 'Error creating posting' };
    } else {
      return accountPosting;
    }
  }

  //get single acocunt posting
  public async show({ params }: HttpContextContract) {
    const accountPostingService = new AccountPostingService(params.accountId);

    return await accountPostingService.getSingle(params.postindId);
  }

  //Delete account posting
  public async destroy({ params, response }: HttpContextContract) {
    const accountPostingService = new AccountPostingService(params.accountId);
    const accountPosting = await accountPostingService.reverse(
      params.postindId
    );

    if (!accountPosting) {
      response.status(400);
      return { error: 'Posting not deleted' };
    } else {
      return accountPosting;
    }
  }

  //Update account posting date: {value, description}
  public async update({ params, request, response }: HttpContextContract) {
    const accountPostingService = new AccountPostingService(params.accountId);

    const value = await accountPostingService.validateValue(request);
    const description = await accountPostingService.validateDescription(
      request
    );

    const accountPosting = await accountPostingService.updatePosting(
      params.postingId,
      value,
      description
    );

    if (!accountPosting) {
      response.status(400);
      return { error: 'Error updating posting' };
    } else {
      return accountPosting;
    }
  }
}
