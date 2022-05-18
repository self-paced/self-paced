import { DataSource } from 'typeorm';
import { Category } from './entity/Category';
import { User } from './entity/User';

let dataSource: DataSource;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3400,
  username: 'root',
  password: 'password',
  database: 'self-paced-db',
  synchronize: true,
  logging: false,
  entities: [User, Category],
  migrations: process.env['TS_NODE_COMPILER_OPTIONS']
    ? ['src/graphql/migration/**/*.ts'] // TypeORM glob patterns only works with module=commonjs
    : [],
  subscribers: [],
});

export const initDataSource = async () => {
  if (dataSource === undefined) {
    dataSource = await AppDataSource.initialize();
  }
};
