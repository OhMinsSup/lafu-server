import {
  ConnectionManager,
  getConnectionManager,
  Connection,
  ConnectionOptions,
  createConnection
} from 'typeorm';
import 'pg'; // Crucial for postgres

const isProd = process.env.NODE_ENV === 'production';
const entities = isProd ? ['src/entity/**/*.js'] : ['src/entity/**/*.ts'];
const migrations = isProd ? ['src/migration/**/*.js'] : ['src/migration/**/*.ts'];
const subscribers = isProd ? ['src/subscriber/**/*.js'] : ['src/subscriber/**/*.ts'];

export default class Database {
  connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  async connect() {
    const password = process.env.TYPEORM_PASSWORD;
    if (!password) {
      throw new Error('Failed to load database password');
    }

    const connectionOptions: ConnectionOptions = {
      entities,
      migrations,
      subscribers,
      password,
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      database: process.env.TYPEORM_DATABASE,
      username: process.env.TYPEORM_USERNAME,
      port: parseInt(process.env.TYPEORM_PORT || '5432', 10),
      synchronize: process.env.SYNCHRONIZE === 'true',
      logging: true
      // appname: 'lafu-v1-server'
    };

    return createConnection(connectionOptions);
  }

  async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`;
    if (this.connectionManager.has(CONNECTION_NAME)) {
      const connection = this.connectionManager.get(CONNECTION_NAME);
      try {
        if (connection.isConnected) {
          await connection.close();
        }
      } catch {}
      return connection.connect();
    }

    console.log(`${process.env.NODE_ENV} Postgres RDBMS connection is established ✅`);
    return this.connect();
  }
}
