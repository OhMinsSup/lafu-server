const isProd = process.env.NODE_ENV === 'production';
const entities = isProd ? ['src/entity/**/*.js'] : ['src/entity/**/*.ts'];
const migrations = isProd ? ['src/migration/**/*.js'] : ['src/migration/**/*.ts'];
const subscribers = isProd ? ['src/subscriber/**/*.js'] : ['src/subscriber/**/*.ts'];

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'veloss',
  password: '1234',
  database: 'lafu-dev',
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
