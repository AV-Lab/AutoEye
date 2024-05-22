import { Token } from 'src/auth/entities/token.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Column({ length: 35 })
  firstName!: String;

  @Column({ length: 35 })
  lastName!: String;

  @Column({ length: 15, unique: true })
  username!: String;

  @Column({ unique: true })
  email!: String;

  @Column()
  password!: String;

  @OneToMany(() => Token, (token) => token.user)
  tokens?: Token[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
