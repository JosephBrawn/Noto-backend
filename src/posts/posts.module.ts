import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { S3Module } from '@/s3/s3.module';
import { S3Service } from '@/s3/s3.service';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User]), S3Module],
  providers: [PostsService, S3Service, UsersService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
