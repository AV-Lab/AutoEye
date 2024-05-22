import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChannelsService } from './channels.service';
import { ChannelPayload } from './dto/channel.payload';
import { Channel } from './entities/channel.entity';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateChannelInput } from './dto/create-channel.input';
import { GraphQLBoolean } from 'graphql';
import { UpdateChannelInput } from './dto/update-channel.input';

@Resolver(() => Channel)
export class ChannelsResolver {
  constructor(private readonly channelsService: ChannelsService) {}

  @IsPublic()
  @Mutation(() => ChannelPayload)
  async createChannel(
    @Args('createChannelInput') createChannelInput: CreateChannelInput,
  ) {
    return await this.channelsService.create(createChannelInput);
  }

  @IsPublic()
  @Query(() => [ChannelPayload], { name: 'channels' })
  async findAll() {
    return await this.channelsService.findAll();
  }

  @IsPublic()
  @Mutation(() => GraphQLBoolean)
  async deleteChannel(@Args('channelId') channelId: String) {
    const deleteChannel = await this.channelsService.delete(channelId);
    return deleteChannel.affected != 0 ? true : false;
  }

  @IsPublic()
  @Mutation(() => GraphQLBoolean)
  async deleteChannels(
    @Args({ name: 'channelIds', type: () => [String] }) channelIds: String[],
  ) {
    const deleteChannels = await this.channelsService.deleteMany(channelIds);
    return deleteChannels.affected != 0 ? true : false;
  }

  @IsPublic()
  @Mutation(() => ChannelPayload)
  async updateChannel(
    @Args('updateChannelInput') updateChannelInput: UpdateChannelInput,
  ) {
    return await this.channelsService.update(updateChannelInput);
  }
}
