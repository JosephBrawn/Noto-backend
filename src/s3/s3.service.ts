import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { basename } from 'path';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(S3Service.name);
  private readonly bucketName: string;
  private readonly endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('BUCKET_NAME');
    this.endpoint = this.configService.getOrThrow<string>('END_POINT');

    this.s3Client = new S3Client({
      region: this.configService.get<string>('REGION') ?? 'us-east-1',
      endpoint: this.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('SECRET_KEY'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = this.generateFileKey(file.originalname);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`Файл успешно загружен: ${key}`);
      return this.getFileUrl(key);
    } catch (error) {
      this.logger.error(`Ошибка загрузки файла: ${error.message}`, error.stack);
      throw new Error(`Ошибка загрузки файла: ${error.message}`);
    }
  }

  async deleteFileByUrl(url: string): Promise<void> {
    const prefix = `${this.endpoint}/${this.bucketName}/`;
    const key = url.startsWith(prefix) ? url.slice(prefix.length) : '';

    if (!key) {
      this.logger.warn(`Невозможно извлечь ключ из URL: ${url}`);
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`Файл удалён: ${key}`);
    } catch (error) {
      this.logger.warn(
        `Ошибка при удалении файла ${key}: ${error.message}`,
        error.stack,
      );
    }
  }

  private generateFileKey(originalname: string): string {
    const safeName = basename(originalname).replace(/\s+/g, '_');
    return `${Date.now()}-${safeName}`;
  }

  private getFileUrl(key: string): string {
    return `${this.endpoint}/${this.bucketName}/${key}`;
  }
}
