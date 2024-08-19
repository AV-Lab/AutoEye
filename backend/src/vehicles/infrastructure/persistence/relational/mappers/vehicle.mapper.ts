import { ChannelEntity } from 'src/channels/infrastructure/persistence/relational/entities/channel.entity';
import { Vehicle } from '../../../../domain/vehicle';
import { VehicleEntity } from '../entities/vehicle.entity';

export class VehicleMapper {
  static toDomain(raw: VehicleEntity): Vehicle {
    let channel = new ChannelEntity();
    channel.id = raw.channel.id;
    channel.name = raw.channel.name;
    const domainEntity = new Vehicle();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.channel = channel;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Vehicle): VehicleEntity {
    let channel = new ChannelEntity();
    channel.id = domainEntity.channel.id;
    channel.name = domainEntity.channel.name;

    const persistenceEntity = new VehicleEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.channel = channel;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
