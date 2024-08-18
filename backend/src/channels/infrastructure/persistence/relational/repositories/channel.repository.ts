import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelEntity } from '../entities/channel.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Channel } from '../../../../domain/channel';
import { ChannelRepository } from '../../channel.repository';
import { ChannelMapper } from '../mappers/channel.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ChannelRelationalRepository implements ChannelRepository {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
  ) {}

  async create(data: Channel): Promise<Channel> {
    const persistenceModel = ChannelMapper.toPersistence(data);
    const newEntity = await this.channelRepository.save(
      this.channelRepository.create(persistenceModel),
    );
    return ChannelMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Channel[]> {
    const entities = await this.channelRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((user) => ChannelMapper.toDomain(user));
  }

  async findById(id: Channel['id']): Promise<NullableType<Channel>> {
    const entity = await this.channelRepository.findOne({
      where: { id },
    });

    return entity ? ChannelMapper.toDomain(entity) : null;
  }

  async update(id: Channel['id'], payload: Partial<Channel>): Promise<Channel> {
    const entity = await this.channelRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.channelRepository.save(
      this.channelRepository.create(
        ChannelMapper.toPersistence({
          ...ChannelMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ChannelMapper.toDomain(updatedEntity);
  }

  async remove(id: Channel['id']): Promise<void> {
    await this.channelRepository.delete(id);
  }
}
