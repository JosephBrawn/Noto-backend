import { Module } from '@nestjs/common';

import { S3Controller } from '@/s3/s3.controller';
import { S3Service } from '@/s3/s3.service';

@Module({
  imports: [],
  providers: [S3Service],
  controllers: [S3Controller],
})
export class S3Module {}
