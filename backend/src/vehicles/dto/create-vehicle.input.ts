import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { GraphQLInt, GraphQLString } from 'graphql';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsUnique } from 'src/common/validators/is-unique.validator';

@InputType()
export class CreateVehicleInput {
  @IsUnique(
    { tableName: 'vehicles', column: 'name' },
    {
      message: i18nValidationMessage('validation.ALREADY_EXISTS', {
        entity: 'vehicle',
      }),
    },
  )
  @MinLength(1, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(30, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  @Field(() => GraphQLString, { description: 'Name' })
  name!: String;

  @Field(() => [String], { description: 'Channels', nullable: true })
  channels: String[];

  @Field(() => GraphQLInt, { description: 'Order' })
  order!: Number;
}
