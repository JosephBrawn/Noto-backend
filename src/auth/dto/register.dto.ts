import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';

import { VALIDATION } from '@/libs/common/constants/validation';
import { IsPasswordMatchingConstraint } from '@/libs/common/decorators/is-password-matching-constraint.decorator';

export class RegisterDto {
  @IsString({ message: 'Имя пользователя должно быть строкой.' })
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым.' })
  @Matches(new RegExp(VALIDATION.USERNAME.REGEXP), {
    message: VALIDATION.USERNAME.MESSAGE,
  })
  username: string;

  @IsString({ message: 'Email должен быть строкой.' })
  @IsEmail({}, { message: 'Некорректный email.' })
  @IsNotEmpty({ message: 'Email не может быть пустым.' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой.' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым.' })
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов.' })
  @Matches(new RegExp(VALIDATION.PASSWORD.REGEXP), {
    message: VALIDATION.PASSWORD.MESSAGE,
  })
  password: string;

  @IsString({ message: 'Подтверждение пароля должно быть строкой.' })
  @IsNotEmpty({ message: 'Подтверждение пароля не может быть пустым.' })
  @MinLength(8, {
    message: 'Подтверждение пароля не может быть менее 8 символов.',
  })
  @Matches(new RegExp(VALIDATION.PASSWORD.REGEXP), {
    message: VALIDATION.PASSWORD.CONFIRM_MESSAGE,
  })
  @Validate(IsPasswordMatchingConstraint, { message: 'Пароли не совпадают.' })
  confirmPassword: string;
}
