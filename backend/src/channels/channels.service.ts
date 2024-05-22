import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { In, IsNull, Repository } from 'typeorm';
import { CreateChannelInput } from './dto/create-channel.input';
import { Channel } from './entities/channel.entity';
import { UpdateChannelInput } from './dto/update-channel.input';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    private readonly i18n: I18nService,
  ) {}

  async create(createChannelInput: CreateChannelInput) {
    const channel = this.channelsRepository.create(createChannelInput);
    return await this.channelsRepository.save(channel);
  }

  async findAll() {
    return await this.channelsRepository.find({
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: String) {
    return await this.channelsRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findByIds(ids: String[]) {
    return await this.channelsRepository.find({ where: { id: In(ids) } });
  }

  async delete(id: String) {
    return await this.channelsRepository.softDelete({ id });
  }

  async deleteMany(ids: String[]) {
    const channelIds = ids.map((id) => id.toString());
    return await this.channelsRepository.softDelete(channelIds);
  }

  async update(updateChannelInput: UpdateChannelInput) {
    const channel = await this.findOne(updateChannelInput.id);

    if (!channel) {
      //throw error
    }

    await this.channelsRepository.update(
      { id: channel?.id },
      updateChannelInput,
    );

    return channel;
  }
}
