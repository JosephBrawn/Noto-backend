import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { User } from '@/users/entities/user.entity';

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return Boolean(data) ? user[data] : user;
  },
);
