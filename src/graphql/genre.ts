import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';

export const typeDef = gql`
  type Genre {
    id: ID!
    genre_name: String
    created_at: String
    updated_at: String
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {};
