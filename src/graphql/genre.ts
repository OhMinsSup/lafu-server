import { gql, IResolvers, ApolloError, AuthenticationError } from 'apollo-server-express';
import Joi from 'joi';
import { ApolloContext } from '../app';
import { BAD_REQUEST } from '../config/exection';
import Genre from '../entity/Genre';
import { getRepository } from 'typeorm';
import AnisGenres from '../entity/AnisGenre';

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
    updateGenre(genreId: String, genreName: String): Boolean
    removeGenre(genreId: String): Boolean
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
    writeGenre: async (_, args: any, ctx) => {
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
    },
    updateGenre: async (_, args: any, ctx) => {
      const schema = Joi.object().keys({
        genreId: Joi.string().required(),
        genreName: Joi.string().required()
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      if (!ctx.user_id) {
        throw new AuthenticationError('Not Logged In');
      }

      const genreRepo = getRepository(Genre);
      await genreRepo
        .createQueryBuilder('genre')
        .update()
        .set({ genre_name: args.genreName })
        .where(
          `
          lower(genre.genre_name) = lower(:name)
          OR lower(replace(genre.genre_name, ' ', '-')) = lower(replace(:name, ' ', '-'))`,
          { name: args.genreName }
        )
        .andWhere('genre.id = :id', { id: args.genreId })
        .execute();

      return true;
    },
    removeGenre: async (_, args: any, ctx) => {
      const schema = Joi.object().keys({
        genreId: Joi.string().required()
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      if (!ctx.user_id) {
        throw new AuthenticationError('Not Logged In');
      }

      const linkRepo = getRepository(AnisGenres);
      const existGenre = await linkRepo
        .createQueryBuilder('anis_genres')
        .where('anis_genres.fk_genre_id = :genreId', { genreId: args.genreId })
        .getMany();

      if (existGenre.length > 0) {
        return false;
      }

      const tagRepo = getRepository(Genre);
      await tagRepo
        .createQueryBuilder('genre')
        .delete()
        .where('id = :id', { id: args.genreId })
        .execute();
      return true;
    }
  }
};
