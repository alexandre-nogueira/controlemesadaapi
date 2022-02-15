import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AccountPostingService } from 'App/Services/AccountPostingService';
import { DateTime } from 'luxon';

export default class AcctPostingsController {
  //Search postings by date
  public async search({ response, request, params }: HttpContextContract) {
    const accountPostingService = new AccountPostingService(params.accountId);

    const dateFrom = await accountPostingService.validateDateFrom(request);
    const dateTo = await accountPostingService.validateDateTo(request);

    // const dateFromSQL: DateTime = DateTime.fromISO('2021-01-01');
    // const dateToSQL: DateTime = DateTime.fromISO('2025-01-01');

    //get account posgings
    const accountPostings = await accountPostingService.getMany(
      // dateFromSQL,
      // dateToSQL
      dateFrom,
      dateTo
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
    const postingDate = await accountPostingService.validateDate(request);

    const accountPosting = await accountPostingService.create(
      value,
      description,
      postingDate
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
    const postingDate = await accountPostingService.validateDate(request);

    const accountPosting = await accountPostingService.updatePosting(
      params.postingId,
      value,
      description,
      postingDate
    );

    if (!accountPosting) {
      response.status(400);
      return { error: 'Error updating posting' };
    } else {
      return accountPosting;
    }
  }
}
