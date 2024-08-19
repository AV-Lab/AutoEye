import { ApiProperty } from '@nestjs/swagger';

import { Channel } from 'src/channels/domain/channel';

export class Vehicle {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: () => Channel })
  channel: Channel;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
