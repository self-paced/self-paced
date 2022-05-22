import { DataSource } from 'typeorm';
import { Course } from './entity/Course';
import { User } from './entity/User';
import { Video } from './entity/Video';

let dataSource: DataSource;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env['MYSQL_HOST'] ?? 'localhost',
  port: parseInt(process.env['MYSQL_PORT'] ?? '3400'),
  username: process.env['MYSQL_USER'] ?? 'root',
  password: process.env['MYSQL_PASSWORD'] ?? 'password',
  database: process.env['MYSQL_DATABASE'] ?? 'self-paced-db',
  synchronize: true, // TODO: set to false in production
  logging: false,
  entities: [User, Course, Video],
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
