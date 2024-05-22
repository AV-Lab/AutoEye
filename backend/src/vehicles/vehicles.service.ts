import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { ChannelsService } from 'src/channels/channels.service';
import { IsNull, Repository } from 'typeorm';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle-input';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehiclesRepository: Repository<Vehicle>,
    private readonly channelsService: ChannelsService,
    private readonly i18n: I18nService,
  ) {}

  async create(createVehicleInput: CreateVehicleInput) {
    const channels = await this.channelsService.findByIds(
      createVehicleInput.channels,
    );

    const vehicle = this.vehiclesRepository.create({
      name: createVehicleInput.name,
      channels,
      order: createVehicleInput.order,
    });

    return await this.vehiclesRepository.save(vehicle);
  }

  async findAll() {
    return await this.vehiclesRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['channels'],
    });
  }

  async findOne(id: String) {
    return await this.vehiclesRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async delete(id: String) {
    return await this.vehiclesRepository.softDelete({ id });
  }

  async deleteMany(ids: String[]) {
    const vehicleIds = ids.map((id) => id.toString());
    return await this.vehiclesRepository.softDelete(vehicleIds);
  }

  async update(updateVehicleInput: UpdateVehicleInput) {
    const vehicle = await this.findOne(updateVehicleInput.id);

    if (!vehicle) {
      //throw error
    }

    let vehicleModel = {};

    if (updateVehicleInput.channels) {
      const channels: any = [];
      const channelIds = updateVehicleInput.channels;

      delete updateVehicleInput.channels;

      channelIds.forEach((channelId) => {
        channels.push({ id: channelId });
      });

      vehicleModel = { channels, ...updateVehicleInput, ...vehicle };
    } else {
      vehicleModel = { ...updateVehicleInput, ...vehicle };
    }

    return await this.vehiclesRepository.save(vehicleModel);
  }
}
