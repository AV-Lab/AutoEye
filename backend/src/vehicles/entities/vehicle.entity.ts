import { Channel } from 'src/channels/entities/channel.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Column({ length: 30 })
  name!: String;

  @Column({ default: 0 })
  order!: Number;

  @ManyToMany(() => Channel, (channel) => channel.vehicles)
  channels: Channel[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
