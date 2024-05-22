import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsResolver } from './channels.resolver';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  providers: [ChannelsResolver, ChannelsService],
  exports: [ChannelsService],
})
export class ChannelsModule {}
