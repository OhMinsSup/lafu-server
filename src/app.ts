import { GraphQLServer } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import helmet from 'helmet';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compresion from 'compression';
import routes from './routes';
import schema from './config/schema';
import createLoaders from './lib/createLoader';

class App {
  public app: GraphQLServer;
  constructor() {
    this.app = new GraphQLServer({
      schema,
      context: contextParams => {
        return {
          req: contextParams.request,
          res: contextParams.response,
          loaders: createLoaders()
        };
      }
    });
    this.initiallizeDB();
    this.middlewares();
  }

  private middlewares() {
    const express = this.app.express;

    express.use(
      compresion({
        level: 6
      })
    );

    express.use(helmet());
    express.use(bodyParser.json());
    express.use(cookieParser());

    if (process.env.NODE_ENV === 'development') {
      express.use(logger('dev'));
    }

    express.use(routes);
  }

  private async initiallizeDB() {
    try {
      await createConnection();
      console.log(`${process.env.NODE_ENV} Postgres RDBMS connection is established ✅`);
    } catch (e) {
      throw e;
    }
  }
}

export default new App().app;
