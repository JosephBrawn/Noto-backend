import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly userService: UsersService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (typeof request.session.userId === 'undefined') {
      console.log("unauthorized request", request.session.userId);
      throw new UnauthorizedException(
        'Пользователь не авторизован. Пожалуйста войдтите в систему, что бы получить доступ',
      );
    }

    const user = await this.userService.findById(request.session.userId);

    request.user = user;

    return true;
  }
}
