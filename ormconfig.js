const isProd = process.env.NODE_ENV === 'production';
const entities = isProd ? ['src/entity/**/*.js'] : ['src/entity/**/*.ts'];
const migrations = isProd ? ['src/entity/**/*.js'] : ['src/entity/**/*.ts'];
const subscribers = isProd ? ['src/entity/**/*.js'] : ['src/entity/**/*.ts'];

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'creatix',
  password: '1234',
  database: 'creatix',
  synchronize: false,
  logging: true,
  entities,
  migrations,
  subscribers,
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  }
};
