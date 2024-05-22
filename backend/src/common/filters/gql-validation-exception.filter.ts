import { UserInputError } from '@nestjs/apollo';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import {
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';

@Catch(I18nValidationException)
export class GqlValidationExceptionFilter implements GqlExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    const i18nError = new I18nValidationExceptionFilter({
      detailedErrors: false,
    }).catch(exception, gqlHost);

    throw new UserInputError('Bad request.', {
      extensions: { i18nError },
    });
  }
}
