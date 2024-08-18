import { Module } from '@nestjs/common';
import { VehicleRepository } from '../vehicle.repository';
import { VehicleRelationalRepository } from './repositories/vehicle.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity])],
  providers: [
    {
      provide: VehicleRepository,
      useClass: VehicleRelationalRepository,
    },
  ],
  exports: [VehicleRepository],
})
export class RelationalVehiclePersistenceModule {}
