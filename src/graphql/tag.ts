import { gql, IResolvers, ApolloError, AuthenticationError } from 'apollo-server-express';
import Joi from 'joi';
import { ApolloContext } from '../app';
import { WriteTag } from '../models/tag';
import { BAD_REQUEST } from '../config/exection';
import Tag from '../entity/Tag';

export const typeDef = gql`
  type Tag {
    id: ID!
    tag_name: String
    created_at: String
    updated_at: String
  }

  extend type Query {
    getTags(): [Tag]
  }

  extend type Mutation {
    writeTag(tagName: String): Tag
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {
  Query: {
    getTags: async (_, __, ___) => {
      const tags = await Tag.getTags();
      return tags;
    }
  },
  Mutation: {
    writeTag: async (_, args: WriteTag, ctx) => {
      const schema = Joi.object().keys({
        tagName: Joi.string().required()
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      if (!ctx.user_id) {
        throw new AuthenticationError('Not Logged In');
      }

      const tag = await Tag.findOrCreate(args.tagName);
      return tag;
    }
  }
};
