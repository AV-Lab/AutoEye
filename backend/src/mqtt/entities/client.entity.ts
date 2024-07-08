import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Server } from './server.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Column()
  username!: String;

  @Column()
  password!: String;

  @ManyToOne(() => Server, (server) => server.clients)
  server: Server;

  @OneToOne(() => Vehicle, (vehicle) => vehicle.client)
  vehicle: Vehicle;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
