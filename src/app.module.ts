import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { IS_DEV_ENV } from '@/libs/common/utils/is-dev-util';

import { AuthModule } from './auth/auth.module';
import AppDataSource from './database/data-source/typeorm';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const transactionalDataSource =
          addTransactionalDataSource(AppDataSource);
        await transactionalDataSource.initialize();
        return transactionalDataSource.options;
      },
    }),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
