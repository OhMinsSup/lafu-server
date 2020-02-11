import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import helmet from 'helmet';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compresion from 'compression';
import cors, { CorsOptions } from 'cors';
import createLoaders, { Loaders } from './lib/createLoader';
import schema from './graphql/schema';
import routes from './routes';
import { consumeUser } from './lib/tokens';

const allowedHosts = [/^https:\/\/lafu.io$/];
const app = express();

app.use(
  compresion({
    level: 6
  })
);
app.use(helmet());
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}
app.use((req, res, next) => {
  const valid = allowedHosts.some(regex => regex.test(req.header('Origin')!));
  if (!valid) return next();
  const corsOptions: CorsOptions = Object.assign(
    {
      origin: true,
      credentials: true
    },
    req.method === 'OPTIONS'
      ? {
          allowedHeaders: [
            'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cookie'
          ],
          methods: ['GET,HEAD,PUT,POST,DELETE,PATCH']
        }
      : {}
  );

  cors(corsOptions);
  return next();
});
app.use(bodyParser.json());
app.use(consumeUser);
app.use(routes);

export type ApolloContext = {
  user_id: string | null;
  loaders: Loaders;
  ip: string;
  unsetCookie: () => void;
};

const apollo = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    try {
      return {
        user_id: res.locals.user_id,
        loaders: createLoaders(),
        ip: req.ip,
        unsetCookie: () => {
          req.cookies('access_token');
          req.cookies('referesh_token');
        }
      };
    } catch (e) {
      return {};
    }
  },
  tracing: process.env.NODE_ENV === 'development'
});
apollo.applyMiddleware({ app, cors: false });

export default app;
