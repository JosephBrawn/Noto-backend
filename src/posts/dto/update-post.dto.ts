import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

import { PostStatus } from '../entities/post.entity';

export class UpdatePostDto {
  @IsOptional()
  content?: Record<string, unknown>;

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
  status?: PostStatus;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  @Type(() => String)
  imagesToDelete?: string[];
}
