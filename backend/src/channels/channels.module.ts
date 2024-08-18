import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { RelationalChannelPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalChannelPersistenceModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [ChannelsService, RelationalChannelPersistenceModule],
})
export class ChannelsModule {}
