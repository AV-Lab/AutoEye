import { Module } from '@nestjs/common';
import { ChannelRepository } from '../channel.repository';
import { ChannelRelationalRepository } from './repositories/channel.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from './entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity])],
  providers: [
    {
      provide: ChannelRepository,
      useClass: ChannelRelationalRepository,
    },
  ],
  exports: [ChannelRepository],
})
export class RelationalChannelPersistenceModule {}
