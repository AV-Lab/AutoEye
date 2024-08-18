import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelRepository } from './infrastructure/persistence/channel.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Channel } from './domain/channel';

@Injectable()
export class ChannelsService {
  constructor(private readonly channelRepository: ChannelRepository) {}

  create(createChannelDto: CreateChannelDto) {
    return this.channelRepository.create(createChannelDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.channelRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Channel['id']) {
    return this.channelRepository.findById(id);
  }

  update(id: Channel['id'], updateChannelDto: UpdateChannelDto) {
    return this.channelRepository.update(id, updateChannelDto);
  }

  remove(id: Channel['id']) {
    return this.channelRepository.remove(id);
  }
}
