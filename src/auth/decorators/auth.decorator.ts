import { applyDecorators, UseGuards } from '@nestjs/common';

import { Roles } from '@/auth/decorators/roles.decorators';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { RolesGuard } from '@/auth/guard/roles.guard';
import type { UserRole } from '@/users/entities/user.entity';

export function Authorization(...roles: UserRole[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }

  return applyDecorators(UseGuards(AuthGuard));
}
