import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({ example: 'Campus', type: String })
  @IsNotEmpty()
  name: string;
}
