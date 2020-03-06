import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';
import Genre from '../entity/Genre';

export const typeDef = gql`
  type Genre {
    id: ID!
    genre_name: String
    created_at: String
    updated_at: String
  }

  extend type Query {
    getGenres: [Genre]
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    getGenres: async (_, __, ___) => {
      const genres = await Genre.getGenres();
      return genres;
    }
  }
};
