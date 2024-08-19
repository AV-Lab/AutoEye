import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Channel } from '../domain/channel';

export class ChannelDto extends Channel {
  @ApiProperty({ readOnly: false })
  @IsUUID()
  id: string;

  @ApiProperty({ readOnly: true })
  name: string;
}
