import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ChannelDto } from 'src/channels/dto/channel.dto';

export class FilterVechilesDto {
  @ApiPropertyOptional({ type: ChannelDto })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChannelDto)
  channel?: ChannelDto[] | null;
}

export class FindAllVehiclesDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}
