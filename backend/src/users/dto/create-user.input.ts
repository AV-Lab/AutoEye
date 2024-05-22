import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GraphQLString } from 'graphql';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsUnique } from 'src/common/validators/is-unique.validator';

@InputType()
export class CreateUserInput {
  @MinLength(1, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(35, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  @Field(() => GraphQLString, { description: 'First Name' })
  firstName!: String;

  @MinLength(1, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(35, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  @Field(() => GraphQLString, { description: 'Last Name' })
  lastName!: String;

  @IsUnique(
    { tableName: 'users', column: 'username' },
    {
      message: i18nValidationMessage('validation.ALREADY_EXISTS', {
        entity: 'user',
      }),
    },
  )
  @MinLength(3, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(15, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  @Field(() => GraphQLString, { description: 'Username' })
  username!: String;

  @IsUnique(
    { tableName: 'users', column: 'email' },
    { message: i18nValidationMessage('validation.USER_EXISTS') },
  )
  @IsEmail(undefined, {
    message: i18nValidationMessage('validation.FIELD_INVALID'),
  })
  @Field(() => GraphQLString, { description: 'Email Address' })
  email!: String;

  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 0,
    },
    {
      message: i18nValidationMessage('validation.STRONG_PASSWORD'),
    },
  )
  @Field(() => GraphQLString, { description: 'Password' })
  password!: String;
}
