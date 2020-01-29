import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';

export const typeDef = gql`
  type Producer {
    id: ID!
    fk_ani_id: ID!
    producer: [String]
    screenplay: [String]
    drawing: [String]
    released_at: String
    created_at: String
    updated_at: String
  }

  type Animation {
    id: ID!
    title: String
    summary: String
    thumbnail: String
    likes: Int
    stars: Int
    recommend: Int
    is_adult: Boolean
    created_at: String
    updated_at: String
    genres: [String]
    tags: [String]
  }

  extend type Mutation {
    writeAnimation(
      title: String
      summary: String
      thumbnail: String
      is_adult: String
      tags: [String]
    ): Animation
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {};
