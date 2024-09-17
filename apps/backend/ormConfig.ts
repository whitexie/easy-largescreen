/* eslint-disable node/prefer-global/process */
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config({ path: './db.env' });

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

export const AppDataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: DB_HOST,
  port: Number.parseInt(DB_PORT || '3306'),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: ['dist/**/*.entity.{js,ts}'],
  logging: ['schema', 'query', 'error', 'warn', 'migration'],
  migrations: [
    path.join(__dirname, `/migrations/*{.ts,.js}`),
  ],
  synchronize: false,
};

const AppDataSource = new DataSource(AppDataSourceOptions);

export default AppDataSource;
