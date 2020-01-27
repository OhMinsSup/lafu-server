import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';

export const typeDef = gql`
  type Broadcasting {
    id: ID!
    contentRating: String!
    broadcast_type: String!
    medium: String!
    created_at: String!
    updated_at: String!
  }

  type Genre {
    id: ID!
    genre: String!
    created_at: String!
    updated_at: String!
  }

  type Tag {
    id: ID!
    tag: String!
    is_review: Boolean!
    created_at: String!
    updated_at: String!
  }

  type Producer {
    id: ID!
    producer: [String]
    drawing: [String]
    released_at: String!
    created_at: String!
    updated_at: String!
  }

  type Animation {
    id: ID!
    title: String!
    summary: String!
    thumbnail: String!
    is_adult: Boolean!
    likes: Int
    stars: Int
    recommend: Int
    created_at: String!
    updated_at: String!
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

export const resolvers: IResolvers<any, ApolloContext> = {
  Mutation: {}
};
