import './config/env';
import { Options } from 'graphql-yoga';
import app from './app';
import {
  GRAPHQL_ENDPOINT,
  PLAYGROUND_ENDPOINT,
  IS_DEV_CLIENT,
  IS_PLAYGROUND
} from './config/contants';

const PORT = process.env.PORT || 4000;

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  cors: {
    origin: [IS_DEV_CLIENT, IS_PLAYGROUND, '*'],
    credentials: true
  }
};

const handleListening = (): void =>
  console.log(`${process.env.NODE_ENV} Listening on http://localhost:${PORT} ✅`);
app.start(appOptions, handleListening);
