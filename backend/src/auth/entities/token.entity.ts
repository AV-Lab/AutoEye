import { User } from 'src/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

@Entity('tokens')
export class Token {
  @PrimaryColumn('uuid')
  jti!: String;

  @Column()
  sub!: String;

  @Column()
  username!: String;

  @Column()
  iat!: Number;

  @Column()
  exp!: Number;

  @Column({
    type: 'simple-enum',
    enum: TokenType,
    default: TokenType.ACCESS,
  })
  tokenType!: TokenType;

  @Column()
  batchRef!: String;

  @ManyToOne(() => User, (user) => user.tokens, { nullable: false })
  user!: User;

  @DeleteDateColumn({ nullable: true })
  revokedAt?: Date;
}
