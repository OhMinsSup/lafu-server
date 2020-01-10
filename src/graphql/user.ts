import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';

export const typeDef = gql`
  type User {

  }

  type UserProfile {

  }

  extend type Query {

  }

  extend type Mutation {

  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {},
  Mutation: {}
};
