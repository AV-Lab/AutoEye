import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { RelationalVehiclePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalVehiclePersistenceModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService, RelationalVehiclePersistenceModule],
})
export class VehiclesModule {}
