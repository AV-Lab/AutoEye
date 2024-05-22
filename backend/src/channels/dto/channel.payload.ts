import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { GraphQLID, GraphQLString } from 'graphql';

@ObjectType()
export class ChannelPayload {
  @Field(() => GraphQLID, { description: 'ID' })
  id!: String;

  @Field(() => GraphQLString, { description: 'Name' })
  name!: String;

  @Field(() => GraphQLString, { description: 'Order', nullable: true })
  order!: String;

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
