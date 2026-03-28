import 'dotenv/config';
import 'tsconfig-paths/register';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const toBoolean = (value?: string): boolean => value === 'true';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL as string,
  synchronize: toBoolean(process.env.DATABASE_SYNCHRONIZE),
  ssl: toBoolean(process.env.DATABASE_SSL)
    ? { rejectUnauthorized: false }
    : false,
  entities: [join(__dirname, '../../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '../migrations/*.{ts,js}')],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
