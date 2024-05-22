import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { GraphQLInt, GraphQLString } from 'graphql';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsUnique } from 'src/common/validators/is-unique.validator';

@InputType()
export class CreateChannelInput {
  @IsUnique(
    { tableName: 'channels', column: 'name' },
    {
      message: i18nValidationMessage('validation.ALREADY_EXISTS', {
        entity: 'channel',
      }),
    },
  )
  @MinLength(1, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(30, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  @Field(() => GraphQLString, { description: 'Name' })
  name!: String;

  @Field(() => GraphQLInt, { description: 'Order' })
  order!: Number;
}
