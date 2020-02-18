import Joi from 'joi';
import { gql, IResolvers, ApolloError } from 'apollo-server-express';
import { getRepository, getManager } from 'typeorm';

import { ApolloContext } from '../app';
import AnisBroadcast from '../entity/AnisBroadcast';
import Broadcast, { BroadcastType } from '../entity/Broadcast';
import { BAD_REQUEST, ALREADY_EXIST, NOT_FOUND } from '../config/exection';

interface BaseBroadcast {
  broadcast: BroadcastType;
}

interface GetBroadcasts {
  cursor: string;
  limit: number;
}

interface WriteBroadcast extends BaseBroadcast {}

interface UpdateBroadcast extends BaseBroadcast {
  broadcastId: string;
}

interface RemoveBroadcast {
  broadcastId: string;
}

export const typeDef = gql`
  enum BroadcastEnum {
    OPEN
    CLOSE
  }

  type Broadcast {
    id: ID!
    broadcast: BroadcastEnum!
    created_at: String
    updated_at: String
  }

  extend type Query {
    getBroadcasts(cursor: ID, limit: Int): [Broadcast]
  }

  extend type Mutation {
    removeBroadcast(broadcastId: String!): Response!
    writeBroadcast(broadcast: BroadcastEnum!): Broadcast!
    updateBroadcast(broadcastId: String!, broadcast: BroadcastEnum!): Response!
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  BroadcastEnum: {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE'
  },
  Query: {
    getBroadcasts: async (_, args: GetBroadcasts) => {
      if (args.limit > 100) {
        throw new ApolloError('Max limit is 100', BAD_REQUEST.name);
      }

      const query = getManager()
        .createQueryBuilder(Broadcast, 'broadcasts')
        .limit(args.limit)
        .orderBy('broadcasts.created_at', 'DESC')
        .addOrderBy('broadcasts.id', 'DESC');

      // pagination
      if (args.cursor) {
        const broadcast = await getRepository(Broadcast).findOne({
          id: args.cursor
        });
        if (!broadcast) {
          throw new ApolloError('invalid cursor');
        }

        query.where('broadcasts.created_at < :date', {
          date: broadcast.created_at,
          id: broadcast.id
        });
        query.orWhere('broadcasts.created_at = :date AND broadcasts.id < :id', {
          date: broadcast.created_at,
          id: broadcast.id
        });
      }

      const broadcasts = await query.getMany();
      return broadcasts;
    }
  },
  Mutation: {
    removeBroadcast: async (_, args: RemoveBroadcast) => {
      const schema = Joi.object().keys({
        broadcastId: Joi.string()
          .uuid()
          .required()
      });

      const result = Joi.validate(schema, args);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      const anisBroadcastRepo = getRepository(AnisBroadcast);
      const broadcastRepo = getRepository(Broadcast);
      const exists = await anisBroadcastRepo
        .createQueryBuilder('anis_broadcast')
        .where('anis_broadcast.fk_broadcast_id = :id', { id: args.broadcastId })
        .getMany();

      if (exists.length > 0) {
        return {
          result: false
        };
      }

      await broadcastRepo
        .createQueryBuilder('broadcasts')
        .delete()
        .where('broadcasts.id = :id', { id: args.broadcastId })
        .execute();
      return {
        result: true
      };
    },
    updateBroadcast: async (_, args: UpdateBroadcast) => {
      const schema = Joi.object().keys({
        broadcastId: Joi.string()
          .uuid()
          .required(),
        broadcast: Joi.string()
          .valid('OPEN', 'CLOSE')
          .required()
      });

      const result = Joi.validate(schema, args);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      const broadcastRepo = getRepository(Broadcast);
      const exists = await broadcastRepo.findOne({
        where: {
          id: args.broadcastId
        }
      });

      if (!exists) {
        throw new ApolloError('Broadcast not found', NOT_FOUND.name);
      }

      await broadcastRepo
        .createQueryBuilder('broadcasts')
        .update()
        .set({
          broadcast: args.broadcast
        })
        .where('broadcasts.id = :id', { id: args.broadcastId })
        .execute();

      return {
        result: true
      };
    },
    writeBroadcast: async (_, args: WriteBroadcast) => {
      const schema = Joi.object().keys({
        broadcast: Joi.string()
          .valid('OPEN', 'CLOSE')
          .required()
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      const broadcastRepo = getRepository(Broadcast);
      // TODO: 로그인 구현시
      // if (!ctx.user_id) {
      //   throw new AuthenticationError('Not Logged In');
      // }

      const exists = await broadcastRepo.findOne({
        where: {
          broadcast: args.broadcast
        }
      });

      if (exists) {
        throw new ApolloError('Already Type Broadcast', ALREADY_EXIST.name);
      }

      const broadcast = new Broadcast();
      broadcast.broadcast = args.broadcast;
      await broadcastRepo.save(broadcast);
      return broadcast;
    }
  }
};
