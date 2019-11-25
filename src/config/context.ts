import { Loaders } from '../lib/createLoader';
import { Request, Response } from 'express';

export type YoGaContext = {
  req?: Request;
  res?: Response;
  loaders?: Loaders;
};

export type Resolver = (parent: any, args: any, context: YoGaContext, info: any) => any;

export interface Resolvers {
  [key: string]: {
    [key: string]: Resolver;
  };
}
