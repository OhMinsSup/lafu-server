import Joi from 'joi';
import { gql, IResolvers, ApolloError } from 'apollo-server-express';
import { getManager, getRepository } from 'typeorm';
import { ApolloContext } from '../../src/app';
import { BAD_REQUEST, NOT_FOUND, ALREADY_EXIST } from '../../src/config/exection';
import Quarter from '../../src/entity/Quarter';
import AnisQuater from '../../src/entity/AnisQuater';

interface BaseQuarter {
  quarter: string;
}

interface GetQuarters {
  cursor: string;
  limit: number;
}

interface WriteQuarter extends BaseQuarter {}

interface UpdateQuarter extends BaseQuarter {
  quarterId: string;
}

interface RemoveQuarter {
  quarterId: string;
}

export const typeDef = gql`
  type Quarter {
    id: ID!
    quarter: String!
    created_at: String
    updated_at: String
  }

  extend type Query {
    getQuarters(cursor: ID, limit: Int): [Quarter]
  }

  extend type Mutation {
    removeQuarter(quarterId: String): Response!
    writeQuarter(quarter: String): Response!
    updateQuarter(quarterId: String, quarter: String): Response!
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    getQuarters: async (_, args: GetQuarters) => {
      if (args.limit > 100) {
        throw new ApolloError('Max limit is 100', BAD_REQUEST.name);
      }

      const query = getManager()
        .createQueryBuilder(Quarter, 'quarters')
        .limit(args.limit)
        .orderBy('quarters.created_at', 'DESC')
        .addOrderBy('quarters.id', 'DESC');

      if (args.cursor) {
        const quarter = await getRepository(Quarter).findOne({
          id: args.cursor
        });

        if (!quarter) {
          throw new ApolloError('invalid cursor');
        }

        query.where('quarters.created_at < :date', {
          date: quarter.created_at,
          id: quarter.id
        });
        query.orWhere('quarters.created_at = :date AND quarters.id < :id', {
          date: quarter.created_at,
          id: quarter.id
        });
      }

      const quarters = await query.getMany();
      return quarters;
    },
    Mutation: {
      removeQuarter: async (_, args: RemoveQuarter, ctx) => {
        const schema = Joi.object().keys({
          quarterId: Joi.string()
            .uuid()
            .required()
        });

        const result = Joi.validate(args, schema);
        if (result.error) {
          throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
        }

        const anisQuaterRepo = getRepository(AnisQuater);
        const quarterRepo = getRepository(Quarter);
        const exists = await anisQuaterRepo
          .createQueryBuilder('anis_quarter')
          .where('anis_quarter.fk_quarter_id = :id', { id: args.quarterId })
          .getMany();

        if (exists.length > 0) {
          return {
            result: false
          };
        }

        await quarterRepo
          .createQueryBuilder('quarters')
          .delete()
          .where('quarters.id = :id', { id: args.quarterId })
          .execute();
        return {
          result: true
        };
      },
      updateQuarter: async (_, args: UpdateQuarter, ctx) => {
        const schema = Joi.object().keys({
          quarterId: Joi.string()
            .uuid()
            .required(),
          quarter: Joi.string().required()
        });

        const result = Joi.validate(args, schema);
        if (result.error) {
          throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
        }

        const quarterRepo = getRepository(Quarter);
        const exists = await quarterRepo.findOne({
          where: {
            id: args.quarterId
          }
        });

        if (!exists) {
          throw new ApolloError('Quarter not found', NOT_FOUND.name);
        }

        await quarterRepo
          .createQueryBuilder('quarters')
          .update()
          .set({
            quarter: args.quarter
          })
          .where(`quarters.id = :id`, { id: args.quarterId })
          .execute();

        return {
          result: true
        };
      },
      writeQuarter: async (_, args: WriteQuarter, ctx) => {
        const schema = Joi.object().keys({
          quarter: Joi.number().required()
        });

        const result = Joi.validate(args, schema);
        if (result.error) {
          throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
        }

        const quarterRepo = getRepository(Quarter);
        // TODO: 로그인 구현시
        // if (!ctx.user_id) {
        //   throw new AuthenticationError('Not Logged In');
        // }

        const existQuarter = await quarterRepo.findOne({
          where: {
            quarter: args.quarter
          }
        });

        if (existQuarter) {
          throw new ApolloError('Already Type Quarter', ALREADY_EXIST.name);
        }

        const quarter = new Quarter();
        quarter.quarter = args.quarter;
        await quarterRepo.save(quarter);
        return quarter;
      }
    }
  }
};
