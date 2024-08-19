import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ChannelDto } from 'src/channels/dto/channel.dto';

export class CreateVehicleDto {
  @ApiProperty({ example: 'GenZ', type: String })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: () => ChannelDto })
  @IsNotEmpty()
  channel: ChannelDto;
}
