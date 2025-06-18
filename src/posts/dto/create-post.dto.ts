import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

import { PostStatus } from '../entities/post.entity';

export class CreatePostDto {
  @IsNotEmpty()
  content: Record<string, unknown>;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @Type(() => String)
  images?: string[];

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus = PostStatus.PUBLISHED;
}
