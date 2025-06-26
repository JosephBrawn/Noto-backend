import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { S3Service } from '@/s3/s3.service';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly s3Service: S3Service,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      userId,
    });
    return this.postRepository.save(post);
  }

  async findAll(params?: { limit?: number; offset?: number }): Promise<Post[]> {
    const limit = params?.limit ?? 5;
    const offset = params?.offset ?? 0;

    return this.postRepository.find({
      relations: {
        user: true,
      },
      take: limit,
      skip: offset,
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number, withUser = true): Promise<Post> {
    const options = {
      where: { id },
      relations: withUser ? ['user'] : [],
    };

    const post = await this.postRepository.findOne(options);

    if (!post) {
      throw new NotFoundException(`Пост не найден`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id, false);
    const imagesToDelete = updatePostDto.imagesToDelete ?? [];

    Object.assign(post, updatePostDto);

    if (updatePostDto.images !== undefined) {
      post.images = updatePostDto.images;
    } else if (imagesToDelete.length > 0) {
      post.images = post.images.filter((url) => !imagesToDelete.includes(url));
    }

    const updatedPost = await this.postRepository.save(post);

    if (imagesToDelete.length > 0) {
      try {
        await this.deleteImagesSafely(imagesToDelete);
      } catch (error) {
        this.logger.error(
          `Ошибка при удалении изображений для поста ${id}: ${error.message}`,
          error.stack,
        );
      }
    }

    return updatedPost;
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id, false);

    const result = await this.postRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Пост не найден`);
    }

    if (post.images.length > 0) {
      try {
        await this.deleteImagesSafely(post.images);
      } catch (error) {
        this.logger.error(
          `Ошибка при удалении изображений для поста ${id}: ${error.message}`,
          error.stack,
        );
      }
    }
  }

  private async deleteImagesSafely(urls: string[]): Promise<void> {
    if (urls.length === 0) {
      return;
    }

    try {
      await Promise.all(
        urls.map((url) =>
          this.s3Service.deleteFileByUrl(url).catch((error) => {
            this.logger.warn(
              `Не удалось удалить файл ${url}: ${error.message}`,
            );
          }),
        ),
      );
    } catch (error) {
      this.logger.error(
        `Критическая ошибка при удалении изображений: ${error.message}`,
        error.stack,
      );
    }
  }
}
