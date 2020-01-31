import { gql, IResolvers, ApolloError, AuthenticationError } from 'apollo-server-express';
import Joi from 'joi';
import { ApolloContext } from '../app';
import { WriteAnimationArgs } from '../models/animation';
import { getRepository } from 'typeorm';
import Animation from '../entity/Animation';
import { BAD_REQUEST } from '../config/exection';
import AnisTags from '../entity/AnisTags';
import AnisGenres from '../entity/AnisGenre';

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
    genres: [Genre]
    tags: [Tag]
  }

  extend type Mutation {
    writeAnimation(
      title: String
      summary: String
      thumbnail: String
      is_adult: Boolean
      tags: [String]
      genres: [String]
    ): Animation
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Mutation: {
    writeAnimation: async (_, args: WriteAnimationArgs, ctx) => {
      const schema = Joi.object().keys({
        title: Joi.string().required(),
        summary: Joi.string().required(),
        thumbnail: Joi.string()
          .uri()
          .required(),
        is_adult: Joi.boolean().required(),
        tags: Joi.array().items(Joi.string()),
        genres: Joi.array().items(Joi.string())
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      if (!ctx.user_id) {
        throw new AuthenticationError('Not Logged In');
      }
      //Tag와 Genre는 id값을 받아서 처리 할 것
      // 왜냐하면 각 태그와 장르로 관리하기 위해서
      const aniRepo = getRepository(Animation);
      const animation = new Animation();
      animation.fk_user_id = ctx.user_id;
      animation.title = args.title;
      animation.summary = args.summary;
      animation.thumbnail = args.thumbnail;
      animation.is_adult = args.is_adult;

      await aniRepo.save(animation);
      const syncTags = await AnisTags.syncAnimationTags(animation.id, args.tags);
      if (!syncTags) {
        throw new ApolloError('Tag value was not deleted or added normally.', BAD_REQUEST.name);
      }

      const syncGenre = await AnisGenres.syncAnimationGenres(animation.id, args.genres);
      if (!syncGenre) {
        throw new ApolloError('Genre value was not deleted or added normally.', BAD_REQUEST.name);
      }

      animation.tags = [];
      animation.genres = [];
      return animation;
    }
  }
};
