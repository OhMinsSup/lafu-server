import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';

export const typeDef = gql`
  type Broadcasting {
    id: ID!
    fk_ani_id: ID!
    contentRating: String
    broadcast_type: String
    medium: String
    created_at: String
    updated_at: String
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {};
