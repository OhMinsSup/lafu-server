import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';
import Tag from '../entity/Tag';

export const typeDef = gql`
  type Tag {
    id: ID!
    tag_name: String
    created_at: String
    updated_at: String
  }

  extend type Query {
    getTags: [Tag]
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    getTags: async (_, __, ___) => {
      const tags = await Tag.getTags();
      return tags;
    }
  }
};
