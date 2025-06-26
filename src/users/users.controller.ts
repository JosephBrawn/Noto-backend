import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/autorized.decorator';
import { User } from '@/users/entities/user.entity';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string): Promise<User> {
    return await this.usersService.findById(+userId);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('me')
  public async findMe(@Authorized('id') userId: string): Promise<User> {
    return await this.usersService.findById(+userId);
  }
}
