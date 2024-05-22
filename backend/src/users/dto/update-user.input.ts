import { Field, InputType, PartialType } from '@nestjs/graphql';
import { GraphQLString } from 'graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => GraphQLString, { description: 'ID' })
  id!: String;
}
