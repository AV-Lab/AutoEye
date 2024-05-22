import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ClientsService } from './clients.service';
import { ClientPayload } from './dto/client.payload';
import { CreateClientInput } from './dto/create-client.input';
import { Client } from './entities/client.entity';

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @IsPublic()
  @Mutation(() => ClientPayload)
  async createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
  ) {
    return await this.clientsService.create(createClientInput);
  }

  @Query(() => [ClientPayload], { name: 'clients' })
  async findAll() {
    return await this.clientsService.findAll();
  }
}
