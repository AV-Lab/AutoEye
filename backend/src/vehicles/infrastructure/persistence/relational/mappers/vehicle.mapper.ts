import { Vehicle } from '../../../../domain/vehicle';
import { VehicleEntity } from '../entities/vehicle.entity';

export class VehicleMapper {
  static toDomain(raw: VehicleEntity): Vehicle {
    const domainEntity = new Vehicle();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Vehicle): VehicleEntity {
    const persistenceEntity = new VehicleEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
