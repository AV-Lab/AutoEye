import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { GraphQLID, GraphQLString } from 'graphql';

@ObjectType()
export class UserPayload {
  @Field(() => GraphQLID, { description: 'ID' })
  id!: String;

  @Field(() => GraphQLString, { description: 'First Name' })
  firstName!: String;

  @Field(() => GraphQLString, { description: 'Last Name' })
  lastName!: String;

  @Field(() => GraphQLString, { description: 'Username' })
  username!: String;

  @Field(() => GraphQLString, { description: 'Email Address' })
  email!: String;

  @Field(() => GraphQLISODateTime, { description: 'Create Date' })
  createdAt!: Date;

  @Field(() => GraphQLISODateTime, { description: 'Update Date' })
  updatedAt!: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Delete Date',
  })
  deletedAt?: Date;
}
