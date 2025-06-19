import {
  DeleteObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
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
    this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
    this.endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT');
    this.logger.log(`endpoint, ${this.endpoint}`);

    const config: S3ClientConfig = {
      region: this.configService.get<string>('S3_REGION') ?? 'us-east-1',
      endpoint: this.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_KEY'),
      },
    };
    this.s3Client = new S3Client(config);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file?.buffer) {
      throw new Error('Отсутсвует полезная информация в файле');
    }

    const key = this.generateFileKey(file.originalname);
    const contentType = file.mimetype || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: contentType,
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`Файл успешно загружен: ${key}`);
      return this.getFileUrl(key);
    } catch (error) {
      this.logger.error(
        `Не удалось загрузить файл: ${error.message}`,
        error.stack,
      );
      throw new Error(`Сбой загрузки файла: ${error.message}`);
    }
  }

  async deleteFileByUrl(url: string): Promise<void> {
    if (!url) {
      this.logger.warn('Удаление невозможно: не передан URL');
      return;
    }

    const key = this.extractKeyFromUrl(url);
    if (!key) {
      this.logger.warn(`Не удалось извлечь ключ из URL: ${url}`);
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`Файл удален: ${key}`);
    } catch (error) {
      this.logger.error(
        `Не удалось удалить файл ${key}: ${error.message}`,
        error.stack,
      );
      throw new Error(`Не удалось удалить файл: ${error.message}`);
    }
  }

  private extractKeyFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, '');
    } catch {
      this.logger.warn(`Неверный формат URL: ${url}`);
      return '';
    }
  }

  private generateFileKey(originalname: string): string {
    if (!originalname) {
      throw new Error('Необходимо указать исходное имя файла');
    }

    const safeName = basename(originalname)
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_\-.]/g, '');

    return `uploads/${Date.now()}-${safeName}`;
  }

  private getFileUrl(key: string): string {
    const cleanEndpoint = this.endpoint.replace(/\/$/, '');
    return `${cleanEndpoint}/${this.bucketName}/${key}`;
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.s3Client.send(new ListBucketsCommand({}));
      return true;
    } catch (error) {
      this.logger.error('Проверка подключения к S3 не удалась', error.stack);
      return false;
    }
  }
}
