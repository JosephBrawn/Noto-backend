import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

config(); // загружаем переменные окружения из .env
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '..', '..', '**', 'entities', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'migrations', '*.ts')],
  synchronize: false,
  logging: true,
});
