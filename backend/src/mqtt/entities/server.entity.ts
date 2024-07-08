import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Client } from './client.entity';

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Column({ length: 30 })
  name!: String;

  @Column()
  host!: String;

  @Column({ length: 5 })
  port!: String;

  @OneToMany(() => Client, (client) => client.server)
  clients: Client[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
