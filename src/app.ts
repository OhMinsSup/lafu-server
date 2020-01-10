import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import helmet from 'helmet';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compresion from 'compression';
import createLoaders, { Loaders } from './lib/createLoader';
import schema from './graphql/schema';
import routes from './routes';

const app = express();

app.use(
  compresion({
    level: 6
  })
);
app.use(helmet());
app.use(bodyParser.json());
app.use(routes);

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

export type ApolloContext = {
  user_id: string | null;
  loaders: Loaders;
};

const apollo = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    try {
      return {
        user_id: res.locals.user_id,
        loaders: createLoaders()
      };
    } catch (e) {
      return {};
    }
  },
  tracing: process.env.NODE_ENV === 'development'
});
apollo.applyMiddleware({ app });

async function initiallizeDB() {
  try {
    await createConnection();
    console.log(`${process.env.NODE_ENV} Postgres RDBMS connection is established ✅`);
  } catch (e) {
    throw e;
  }
}

initiallizeDB();

export default app;
