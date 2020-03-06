import { gql, IResolvers, ApolloError, AuthenticationError } from 'apollo-server-express';
import Joi from 'joi';
import { ApolloContext } from '../app';
import { getRepository } from 'typeorm';
import Animation, { BroadcastType } from '../entity/Animation';
import { BAD_REQUEST } from '../config/exection';
import AnisTags from '../entity/AnisTags';
import AnisGenres from '../entity/AnisGenre';
import Tag from '../entity/Tag';
import Genre from '../entity/Genre';
import Episode from '../entity/Episode';
import AnisEpisodes from '../entity/AnisEpisodes';

export const typeDef = gql`
  enum BroadcastEnum {
    OPEN
    CLOSE
  }

  type Animation {
    id: ID!
    title: String
    summary: String
    thumbnail: String
    likes: Int
    stars: Int
    broadcast: BroadcastEnum!
    recommend: Int
    is_adult: Boolean
    created_at: String
    updated_at: String
    genres: [Genre]
    tags: [Tag]
    episodes: [Episode]
  }

  type Episode {
    id: ID!
    title: String
    subject: String
    description: String
    thumbnail: String
    op_start: Int
    op_end: Int
    ed_start: Int
    ed_end: Int
    action_time: Int
    episode_order: Int
    running_time: Int
    fileUrl: String
    created_at: String
    updated_at: String
  }

  extend type Mutation {
    writeAnimation(
      title: String
      summary: String
      thumbnail: String
      is_adult: Boolean
      broadcast: BroadcastEnum
      tags: [String]
      genres: [String]
      episodeIds: [String]
    ): Animation
  }
`;

interface WriteAnimation {
  title: string;
  summary: string;
  thumbnail: string;
  is_adult: boolean;
  broadcast: BroadcastType;
  tags: string[];
  genres: string[];
  episodeIds: string[];
}

export const resolvers: IResolvers<any, ApolloContext> = {
  BroadcastEnum: {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE'
  },
  Mutation: {
    writeAnimation: async (_, args: WriteAnimation, ctx) => {
      const schema = Joi.object().keys({
        title: Joi.string().required(),
        summary: Joi.string().required(),
        thumbnail: Joi.string()
          .uri()
          .required(),
        broadcast: Joi.string()
          .valid('OPEN', 'CLOSE')
          .required(),
        is_adult: Joi.boolean().required(),
        tags: Joi.array().items(Joi.string()),
        genres: Joi.array().items(Joi.string()),
        episodeIds: Joi.array().items(
          Joi.string()
            .uuid()
            .required()
        )
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      if (!ctx.user_id) {
        throw new AuthenticationError('Not Logged In');
      }

      const aniRepo = getRepository(Animation);

      const animation = new Animation();
      animation.fk_user_id = ctx.user_id;
      animation.title = args.title;
      animation.broadcast = args.broadcast;
      animation.summary = args.summary;
      animation.thumbnail = args.thumbnail;
      animation.is_adult = args.is_adult;

      await aniRepo.save(animation);

      const tagsData = await Promise.all(args.tags.map(Tag.findTag));
      const genresData = await Promise.all(args.genres.map(Genre.findGenre));
      const episodeData = await Promise.all(args.episodeIds.map(Episode.findEpisode));

      const syncTags = await AnisTags.syncAnimationTags(animation.id, tagsData);
      if (!syncTags) {
        throw new ApolloError('Tag value was not deleted or added normally.', BAD_REQUEST.name);
      }

      const syncGenre = await AnisGenres.syncAnimationGenres(animation.id, genresData);
      if (!syncGenre) {
        throw new ApolloError('Genre value was not deleted or added normally.', BAD_REQUEST.name);
      }

      const syncEpisode = await AnisEpisodes.syncAnimationEpisode(animation.id, episodeData);
      if (!syncEpisode) {
        throw new ApolloError('Episode value was not deleted or added normarlly', BAD_REQUEST.name);
      }

      animation.tags = tagsData;
      animation.genres = genresData;
      return animation;
    }
  }
};
