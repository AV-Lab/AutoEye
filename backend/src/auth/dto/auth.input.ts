import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class AuthInput {
  @IsNotEmpty({ message: i18nValidationMessage('validation.FIELD_EMPTY') })
  @Field(() => String, { description: 'Username' })
  username!: String;

  @IsNotEmpty({ message: i18nValidationMessage('validation.FIELD_EMPTY') })
  @Field(() => String, { description: 'Password' })
  password!: String;
}
