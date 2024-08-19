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
import { ChannelEntity } from 'src/channels/infrastructure/persistence/relational/entities/channel.entity';

@Entity({
  name: 'vehicle',
})
export class VehicleEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({
    type: () => ChannelEntity,
  })
  @ManyToOne(() => ChannelEntity, (channel) => channel.vehicles, {
    eager: true,
  })
  channel: ChannelEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
