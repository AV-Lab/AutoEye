import { Channel } from 'src/channels/entities/channel.entity';
import { Client } from 'src/mqtt/entities/client.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
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

  @OneToOne(() => Client, (client) => client.vehicle)
  @JoinColumn()
  client: Client;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
