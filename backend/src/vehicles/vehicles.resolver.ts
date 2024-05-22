import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLBoolean } from 'graphql';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle-input';
import { VehiclePayload } from './dto/vehicle.payload';
import { Vehicle } from './entities/vehicle.entity';
import { VehiclesService } from './vehicles.service';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @IsPublic()
  @Mutation(() => VehiclePayload)
  async createVehicle(
    @Args('createVehicleInput') createVehicleInput: CreateVehicleInput,
  ) {
    return await this.vehiclesService.create(createVehicleInput);
  }

  @IsPublic()
  @Query(() => [VehiclePayload], { name: 'vehicles' })
  async findAll() {
    return await this.vehiclesService.findAll();
  }

  @IsPublic()
  @Mutation(() => GraphQLBoolean)
  async deleteVehicle(@Args('vehicleId') vehicleId: String) {
    const deleteVehicle = await this.vehiclesService.delete(vehicleId);
    return deleteVehicle.affected != 0 ? true : false;
  }

  @IsPublic()
  @Mutation(() => GraphQLBoolean)
  async deleteVehicles(
    @Args({ name: 'vehicleIds', type: () => [String] }) vehicleIds: String[],
  ) {
    const deleteVehicles = await this.vehiclesService.deleteMany(vehicleIds);
    return deleteVehicles.affected != 0 ? true : false;
  }

  @IsPublic()
  @Mutation(() => VehiclePayload)
  async updateVehicle(
    @Args('updateVehicleInput') updateVehicleInput: UpdateVehicleInput,
  ) {
    return await this.vehiclesService.update(updateVehicleInput);
  }
}
