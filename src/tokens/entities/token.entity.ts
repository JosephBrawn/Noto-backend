import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum TokenType {
  VERIFICATION = 'verification',
  TWO_FACTOR = 'two_factor',
  PASSWORD_RESET = 'password_reset',
}

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  token: string;

  @Column({
    type: 'enum',
    enum: TokenType,
    nullable: false,
  })
  type: TokenType;

  @Column({
    type: 'timestamp',
    name: 'expires_in',
    nullable: false,
  })
  expiresIn: Date;
}
