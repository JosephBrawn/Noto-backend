import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { AuthMethod } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail({}, { message: 'Некорректный email' })
  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;

  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  username: string;

  @IsEnum(AuthMethod, { message: 'Некорректный метод' })
  @IsNotEmpty({ message: 'Метод не может быть пустым' })
  method: AuthMethod;

  @IsString({ message: 'Фотография должна быть строкой' })
  @IsOptional()
  picture?: string;

  @IsBoolean({ message: 'isVerified должен быть логическим значением' })
  @IsOptional()
  isVerified: boolean;
}
