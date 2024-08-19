import { ApiProperty } from '@nestjs/swagger';
import { Vehicle } from 'src/vehicles/domain/vehicle';

export class Channel {
  @ApiProperty({
    type: String,
    readOnly: true,
  })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({
    type: () => Vehicle,
    readOnly: true,
  })
  vehicles?: Vehicle[] | null;

  @ApiProperty({ type: Number, readOnly: true })
  vehiclesCount?: number | null;

  @ApiProperty({ readOnly: true })
  createdAt: Date;

  @ApiProperty({ readOnly: true })
  updatedAt: Date;
}
