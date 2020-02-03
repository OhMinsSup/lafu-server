import { gql, IResolvers, AuthenticationError } from 'apollo-server-express';
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

  extend type Mutation {
    createBroadcasting(name: String!): Broadcasting
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Mutation: {
    createBroadcasting: async (parent, args, ctx) => {
      if (!ctx.user_id) {
        throw new AuthenticationError('Not Logged In');
      }
    }
  }
};
