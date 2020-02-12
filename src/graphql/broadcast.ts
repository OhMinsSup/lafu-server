import Joi from 'joi';
import { gql, IResolvers, ApolloError } from 'apollo-server-express';
import { getRepository } from 'typeorm';

import { ApolloContext } from '../app';
import Broadcast, { BroadcastType } from '../entity/Broadcast';
import { BAD_REQUEST, ALREADY_EXIST, NOT_FOUND } from '../config/exection';

interface BaseBroadcast {
  broadcast: BroadcastType;
}

interface WriteBroadcast extends BaseBroadcast {}

interface UpdateBroadcast extends BaseBroadcast {
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

  extend type Mutation {
    writeBroadcast(broadcast: BroadcastEnum!): Broadcast!
    updateBroadcast(broadcastId: String!, broadcast: BroadcastEnum!): Response!
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  BroadcastEnum: {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE'
  },
  Mutation: {
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
