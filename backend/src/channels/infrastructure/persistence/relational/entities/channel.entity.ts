import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleEntity } from 'src/vehicles/infrastructure/persistence/relational/entities/vehicle.entity';

@Entity({
  name: 'channel',
})
export class ChannelEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({
    type: () => VehicleEntity,
  })
  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.channel)
  vehicles?: VehicleEntity[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
