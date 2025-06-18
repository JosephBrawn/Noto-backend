import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '@/auth/decorators/roles.decorators';
import { UserRole } from '@/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    if (!Boolean(roles)) {
      return true;
    }

    if (!roles.includes(request.user.roles)) {
      throw new ForbiddenException(
        'Недостаточно прав. У вас нет прав доступа к этому ресурсу',
      );
    }
    return true;
  }
}
