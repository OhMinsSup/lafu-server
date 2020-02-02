import { gql, IResolvers, ApolloError, AuthenticationError } from 'apollo-server-express';
import Joi from 'joi';
import { ApolloContext } from '../app';
import { WriteGenre } from '../models/genre';
import { BAD_REQUEST } from '../config/exection';
import Genre from '../entity/Genre';

export const typeDef = gql`
  type Genre {
    id: ID!
    genre_name: String
    created_at: String
    updated_at: String
  }

  extend type Query {
    getGenres(): [Genre]
  }

  extend type Mutation {
    writeGenre(genreName: String): Genre
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    getGenres: async (_, __, ___) => {
      const genres = await Genre.getGenres();
      return genres;
    }
  },
  Mutation: {
    writeGenre: async (_, args: WriteGenre, ctx) => {
      const schema = Joi.object().keys({
        genreName: Joi.string().required()
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      if (!ctx.user_id) {
        throw new AuthenticationError('Not Logged In');
      }

      const genre = await Genre.findOrCreate(args.genreName);
      return genre;
    }
  }
};
