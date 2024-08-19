import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'GenZ', type: String })
  @IsNotEmpty()
  name: string;
}
