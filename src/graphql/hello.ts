import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';

export const typeDef = gql`
  type HelloResponse {
    result: String
  }

  extend type Query {
    hello(name: String): HelloResponse!
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    hello: (parent: any, args: any, context: ApolloContext) => {
      return {
        result: `Hello ${args.name || 'World'}`
      };
    }
  }
};
