import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { GraphQLInt, GraphQLString } from 'graphql';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class UpdateVehicleInput {
  @Field(() => GraphQLString, { description: 'ID' })
  id!: String;

  @IsOptional()
  @MinLength(1, { message: i18nValidationMessage('validation.MIN_LENGTH') })
  @MaxLength(30, { message: i18nValidationMessage('validation.MAX_LENGTH') })
  @Field(() => GraphQLString, { description: 'Name', nullable: true })
  name?: String;

  @Field(() => [String], { description: 'Channels', nullable: true })
  channels?: String[];

  @Field(() => GraphQLInt, { description: 'Order', nullable: true })
  order?: Number;
}
