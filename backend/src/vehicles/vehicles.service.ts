import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleRepository } from './infrastructure/persistence/vehicle.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Vehicle } from './domain/vehicle';

@Injectable()
export class VehiclesService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  create(createVehicleDto: CreateVehicleDto) {
    return this.vehicleRepository.create(createVehicleDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.vehicleRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOne(id: Vehicle['id']) {
    return this.vehicleRepository.findById(id);
  }

  update(id: Vehicle['id'], updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleRepository.update(id, updateVehicleDto);
  }

  remove(id: Vehicle['id']) {
    return this.vehicleRepository.remove(id);
  }
}
