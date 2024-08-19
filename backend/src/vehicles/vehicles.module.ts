import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { RelationalVehiclePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [RelationalVehiclePersistenceModule, ChannelsModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService, RelationalVehiclePersistenceModule],
})
export class VehiclesModule {}
