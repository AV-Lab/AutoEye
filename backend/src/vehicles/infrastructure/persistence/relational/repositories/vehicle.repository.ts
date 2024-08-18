import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../entities/vehicle.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Vehicle } from '../../../../domain/vehicle';
import { VehicleRepository } from '../../vehicle.repository';
import { VehicleMapper } from '../mappers/vehicle.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class VehicleRelationalRepository implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async create(data: Vehicle): Promise<Vehicle> {
    const persistenceModel = VehicleMapper.toPersistence(data);
    const newEntity = await this.vehicleRepository.save(
      this.vehicleRepository.create(persistenceModel),
    );
    return VehicleMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Vehicle[]> {
    const entities = await this.vehicleRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((user) => VehicleMapper.toDomain(user));
  }

  async findById(id: Vehicle['id']): Promise<NullableType<Vehicle>> {
    const entity = await this.vehicleRepository.findOne({
      where: { id },
    });

    return entity ? VehicleMapper.toDomain(entity) : null;
  }

  async update(id: Vehicle['id'], payload: Partial<Vehicle>): Promise<Vehicle> {
    const entity = await this.vehicleRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.vehicleRepository.save(
      this.vehicleRepository.create(
        VehicleMapper.toPersistence({
          ...VehicleMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return VehicleMapper.toDomain(updatedEntity);
  }

  async remove(id: Vehicle['id']): Promise<void> {
    await this.vehicleRepository.delete(id);
  }
}
