import Joi from 'joi';
import { gql, IResolvers, ApolloError } from 'apollo-server-express';
import { getManager, getRepository } from 'typeorm';
import { ApolloContext } from 'src/app';
import { BAD_REQUEST, NOT_FOUND, ALREADY_EXIST } from 'src/config/exection';
import Old from 'src/entity/Old';
import AnisOld from 'src/entity/AnisOld';

interface BaseOld {
  old: number;
}

interface GetOlds {
  cursor: string;
  limit: number;
}

interface WriteOld extends BaseOld {}

interface UpdateOld extends BaseOld {
  oldId: string;
}

interface RemoveOld {
  oldId: string;
}

export const typeDef = gql`
  type Old {
    id: ID!
    old: Int!
    created_at: String
    updated_at: String
  }

  extend type Query {
    getOlds(cursor: ID, limit: Int): [Old]
  }

  extend type Mutation {
    removeOld(oldId: String): Response!
    writeOld(oldId: String): Response!
    updateOld(oldId: String): Response!
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    getOlds: async (_, args: GetOlds) => {
      if (args.limit > 100) {
        throw new ApolloError('Max limit is 100', BAD_REQUEST.name);
      }

      const query = getManager()
        .createQueryBuilder(Old, 'olds')
        .limit(args.limit)
        .orderBy('olds.created_at', 'DESC')
        .addOrderBy('olds.id', 'DESC');

      if (args.cursor) {
        const old = await getRepository(Old).findOne({
          id: args.cursor
        });

        if (!old) {
          throw new ApolloError('invalid cursor');
        }

        query.where('olds.created_at < :date', {
          date: old.created_at,
          id: old.id
        });
        query.orWhere('olds.created_at = :date AND mediums.id < :id', {
          date: old.created_at,
          id: old.id
        });
      }

      const mediums = await query.getMany();
      return mediums;
    },
    Mutation: {
      removeOld: async (_, args: RemoveOld, ctx) => {
        const schema = Joi.object().keys({
          oldId: Joi.string()
            .uuid()
            .required()
        });

        const result = Joi.validate(args, schema);
        if (result.error) {
          throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
        }

        const anisOldRepo = getRepository(AnisOld);
        const oldRepo = getRepository(Old);
        const exists = await anisOldRepo
          .createQueryBuilder('anis_old')
          .where('anis_old.fk_old_id = :id', { id: args.oldId })
          .getMany();

        if (exists.length > 0) {
          return {
            result: false
          };
        }

        await oldRepo
          .createQueryBuilder('olds')
          .delete()
          .where('olds.id = :id', { id: args.oldId })
          .execute();
        return {
          result: true
        };
      },
      updateOld: async (_, args: UpdateOld, ctx) => {
        const schema = Joi.object().keys({
          oldId: Joi.string()
            .uuid()
            .required(),
          old: Joi.number().required()
        });

        const result = Joi.validate(args, schema);
        if (result.error) {
          throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
        }

        const oldRepo = getRepository(Old);
        const exists = await oldRepo.findOne({
          where: {
            id: args.oldId
          }
        });

        if (!exists) {
          throw new ApolloError('Medium not found', NOT_FOUND.name);
        }

        await oldRepo
          .createQueryBuilder('olds')
          .update()
          .set({
            old: args.old
          })
          .where(`olds.id = :id`, { id: args.oldId })
          .execute();

        return {
          result: true
        };
      },
      writeMedium: async (_, args: WriteOld, ctx) => {
        const schema = Joi.object().keys({
          old: Joi.number().required()
        });

        const result = Joi.validate(args, schema);
        if (result.error) {
          throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
        }

        const oldRepo = getRepository(Old);
        // TODO: 로그인 구현시
        // if (!ctx.user_id) {
        //   throw new AuthenticationError('Not Logged In');
        // }

        const existOld = await oldRepo.findOne({
          where: {
            old: args.old
          }
        });

        if (existOld) {
          throw new ApolloError('Already Type Old', ALREADY_EXIST.name);
        }

        const old = new Old();
        old.old = args.old;
        await oldRepo.save(old);
        return old;
      }
    }
  }
};
