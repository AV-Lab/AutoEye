import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Vehicle } from '../../domain/vehicle';

export abstract class VehicleRepository {
  abstract create(
    data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Vehicle>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Vehicle[]>;

  abstract findById(id: Vehicle['id']): Promise<NullableType<Vehicle>>;

  abstract update(
    id: Vehicle['id'],
    payload: DeepPartial<Vehicle>,
  ): Promise<Vehicle | null>;

  abstract remove(id: Vehicle['id']): Promise<void>;
}
