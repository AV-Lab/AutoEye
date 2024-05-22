import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLID, GraphQLString } from 'graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserPayload } from './dto/user.payload';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Mutation(() => UserPayload)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.usersService.create(createUserInput);
  }

  @Query(() => [UserPayload], { name: 'users' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Query(() => UserPayload, { name: 'user' })
  async findOne(@Args('id', { type: () => GraphQLID }) id: String) {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => UserPayload)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => GraphQLString)
  async deleteUser(@Args('id', { type: () => GraphQLString }) id: String) {
    return await this.usersService.delete(id);
  }
}
