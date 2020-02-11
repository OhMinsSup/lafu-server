import { gql, IResolvers, ApolloError } from 'apollo-server-express';
import Joi from 'joi';
import { ApolloContext } from '../app';
import { BAD_REQUEST, ALREADY_EXIST, NOT_FOUND } from '../config/exection';
import Medium, { MediumType } from '../entity/Medium';
import AnisMedium from '../entity/AnisMedium';
import { getRepository } from 'typeorm';

interface BaseMedium {
  medium: MediumType;
}

interface WriteMedium extends BaseMedium {}

interface UpdateMedium extends BaseMedium {
  mediumId: string;
}

interface RemoveMedium {
  mediumId: string;
}

export const typeDef = gql`
  enum MediumEnum {
    TVA
    OVA
    MOVIE
  }

  type Medium {
    id: ID!
    medium: MediumEnum!
    created_at: String
    updated_at: String
  }

  extend type Mutation {
    removeMedium(mediumId: String): Response!
    writeMedium(medium: MediumEnum!): Medium!
    updateMedium(mediumId: String!, medium: MediumEnum!): Response!
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  MediumEnum: {
    TVA: 'TVA',
    OVA: 'OVA',
    MOVIE: 'MOVIE'
  },
  Mutation: {
    removeMedium: async (_, args: RemoveMedium, ctx) => {
      const schema = Joi.object().keys({
        mediumId: Joi.string()
          .uuid()
          .required()
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      const anisMediumRepo = getRepository(AnisMedium);
      const mediumRepo = getRepository(Medium);
      const exists = await anisMediumRepo
        .createQueryBuilder('anis_medium')
        .where('anis_medium.fk_medium_id = :id', { id: args.mediumId })
        .getMany();

      if (exists.length > 0) {
        return {
          result: false
        };
      }

      await mediumRepo
        .createQueryBuilder('mediums')
        .delete()
        .where('mediums.id = :id', { id: args.mediumId })
        .execute();
      return {
        result: true
      };
    },
    updateMedium: async (_, args: UpdateMedium, ctx) => {
      const schema = Joi.object().keys({
        mediumId: Joi.string()
          .uuid()
          .required(),
        medium: Joi.string()
          .valid('TVA', 'OVA', 'MOVIE')
          .required()
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      const mediumRepo = getRepository(Medium);
      const exists = await mediumRepo.findOne({
        where: {
          id: args.mediumId
        }
      });

      if (!exists) {
        throw new ApolloError('Medium not found', NOT_FOUND.name);
      }

      await mediumRepo
        .createQueryBuilder('mediums')
        .update()
        .set({
          medium: args.medium
        })
        .where(`mediums.id = :id`, { id: args.mediumId })
        .execute();

      return {
        result: true
      };
    },
    writeMedium: async (_, args: WriteMedium, ctx) => {
      const schema = Joi.object().keys({
        medium: Joi.string()
          .valid('TVA', 'OVA', 'MOVIE')
          .required()
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      const mediumRepo = getRepository(Medium);
      // TODO: 로그인 구현시
      // if (!ctx.user_id) {
      //   throw new AuthenticationError('Not Logged In');
      // }

      const existMedium = await mediumRepo.findOne({
        where: {
          medium: args.medium
        }
      });

      if (existMedium) {
        throw new ApolloError('Already Type Medium', ALREADY_EXIST.name);
      }

      const medium = new Medium();
      medium.medium = args.medium;
      await mediumRepo.save(medium);
      return medium;
    }
  }
};