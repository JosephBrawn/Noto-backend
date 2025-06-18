import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@/users/entities/user.entity';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'auth_type',
    nullable: false,
  })
  authType: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'auth_provider',
    nullable: false,
  })
  authProvider: string;

  @Column({
    type: 'text',
    name: 'access_token',
    nullable: true,
  })
  accessToken?: string;

  @Column({
    type: 'text',
    name: 'refresh_token',
    nullable: true,
  })
  refreshToken?: string;

  @Column({
    type: 'int',
    name: 'user_id',
    nullable: true,
  })
  @Index('idx_account_user_id')
  userId?: number;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id' })
  @Index('idx_account_user')
  user?: User;

  @Column({
    type: 'int',
    name: 'expires_at',
    nullable: false,
  })
  expiresAt: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
