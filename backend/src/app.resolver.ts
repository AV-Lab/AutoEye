import { Query, Resolver } from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql';
import { AppService } from './app.service';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => GraphQLBoolean)
  async health(): Promise<Boolean> {
    return this.appService.getHealth();
  }
}
