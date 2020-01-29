import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';

export const typeDef = gql`
  type Tag {
    id: ID!
    tag_name: String
    is_review: Boolean
    created_at: String
    updated_at: String
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {};
