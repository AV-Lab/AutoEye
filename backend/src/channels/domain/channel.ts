import { ApiProperty } from '@nestjs/swagger';

export class Channel {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
