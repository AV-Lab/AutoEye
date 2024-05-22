import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { GraphQLString } from 'graphql';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsUnique } from 'src/common/validators/is-unique.validator';

@InputType()
export class CreateClientInput {
  @IsUnique(
    { tableName: 'clients', column: 'name' },
    { message: i18nValidationMessage('validation.USER_EXISTS') },
  )
  @MinLength(1, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(30, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  @Field(() => GraphQLString, { description: 'Name' })
  name!: String;

  @Field(() => GraphQLString, { description: 'Connection Options' })
  connectionOptions!: String;
}
