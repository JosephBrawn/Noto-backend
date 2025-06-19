import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadResponseDto } from '@/s3/dto/s3-response.dto';
import { S3Service } from '@/s3/s3.service';

@Controller('files')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<UploadResponseDto> {
    if (!file?.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Файл не был загружен или пуст');
    }

    const maxSizeMB = 100;
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new BadRequestException(
        `Файл слишком большой (макс. ${maxSizeMB}MB)`,
      );
    }

    const url = await this.s3Service.uploadFile(file);

    return {
      status: HttpStatus.CREATED,
      message: 'Файл успешно загружен',
      url: url,
    };
  }
}
