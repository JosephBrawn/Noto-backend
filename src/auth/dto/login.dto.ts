import { VALIDATION } from '@/libs/common/constants/validation';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым.' })
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов.' })
  @Matches(new RegExp(VALIDATION.PASSWORD.REGEXP), {
    message: VALIDATION.PASSWORD.MESSAGE,
  })
  password: string;
}
