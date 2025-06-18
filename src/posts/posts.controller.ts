import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/autorized.decorator';
import { canUserModifyPost } from '@/libs/common/utils/validate-access-post.util';
import { UserRole } from '@/users/entities/user.entity';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Authorization(UserRole.User, UserRole.Admin, UserRole.Moderator)
  @Post()
  async create(
    @Authorized('id') userId: string,
    @Authorized('roles') roles: UserRole[],
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {

    return this.postsService.create(createPostDto, +userId);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Authorization(UserRole.User, UserRole.Admin, UserRole.Moderator)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Authorized('id') userId: string,
  ): Promise<PostEntity> {
    const post = await this.postsService.findOne(id);

    if (post.userId !== +userId) {
      throw new ForbiddenException('Вы не можете редактировать этот пост');
    }

    return this.postsService.update(id, updatePostDto);
  }

  @Authorization(UserRole.User, UserRole.Admin, UserRole.Moderator)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Authorized('id') userId: string,
    @Authorized('roles') roles: UserRole[],
  ): Promise<void> {
    const post = await this.postsService.findOne(id);
    if (!canUserModifyPost(+userId, post.userId, roles)) {
      throw new ForbiddenException('Вы не можете удалить этот пост');
    }
    return this.postsService.remove(id);
  }
}
