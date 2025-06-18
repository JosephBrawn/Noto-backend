import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Account } from '@/accounts/entities/account.entity';
import { VALIDATION } from '@/libs/common/constants/validation';

export enum AuthMethod {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google',
  YANDEX = 'yandex',
}

export enum UserRole {
  User = 'user',
  Moderator = 'moderator',
  Admin = 'admin',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: VALIDATION.EMAIL.LENGTH.MAX,
    nullable: false,
  })
  @Index('idx_user_email', { unique: true })
  email: string;

  @Column({
    type: 'varchar',
    length: VALIDATION.PASSWORD.LENGTH.MAX,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: VALIDATION.USERNAME.LENGTH.MAX,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'enum',
    enum: AuthMethod,
    default: AuthMethod.CREDENTIALS,
  })
  method: AuthMethod;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  picture?: string;

  @Column({
    type: 'boolean',
    name: 'is_verified',
    default: false,
  })
  isVerified: boolean;

  @Column({
    type: 'boolean',
    name: 'is_two_factor_enabled',
    default: false,
  })
  isTwoFactorEnabled: boolean;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

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
