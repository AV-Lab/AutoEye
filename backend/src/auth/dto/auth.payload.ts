import { Field, ObjectType } from '@nestjs/graphql';
import { UserPayload } from 'src/users/dto/user.payload';

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  accessToken!: String;

  @Field(() => UserPayload)
  user!: UserPayload;
}
