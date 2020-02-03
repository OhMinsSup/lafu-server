import { gql, IResolvers, ApolloError, AuthenticationError } from 'apollo-server-express';
import Joi from 'joi';
import { ApolloContext } from '../app';
import { writeTag, removeTag, updateTag } from '../models/tag';
import { BAD_REQUEST } from '../config/exection';
import Tag from '../entity/Tag';
import { getRepository } from 'typeorm';
import AnisTags from '../entity/AnisTags';

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
    updateTag: (tagId: String, tagName: String): Boolean
    removeTag(tagId: String): Boolean
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
    writeTag: async (_, args: writeTag, ctx) => {
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
    },
    updateTag: async (_, args: updateTag, ctx) => {
      const schema = Joi.object().keys({
        tagId: Joi.string().required(),
        tagName: Joi.string().required()
      });

      const result = Joi.validate(args, schema);
      if (result.error) {
        throw new ApolloError('You are sending wrong parameters.', BAD_REQUEST.name);
      }

      if (!ctx.user_id) {
        throw new AuthenticationError('Not Logged In');
      }

      const tagRepo = getRepository(Tag);
      await tagRepo
        .createQueryBuilder('tag')
        .update()
        .set({ tag_name: args.tagName })
        .where(
          `
        lower(tag.tag_name) = lower(:name)
        OR lower(replace(tag.name, ' ', '-')) = lower(replace(:name, ' ', '-'))
        `,
          {
            name: args.tagName
          }
        )
        .andWhere(' tag.id = :id', { id: args.tagId })
        .execute();

      return true;
    },
    removeTag: async (_, args: removeTag, ctx) => {
      if (!ctx.user_id) {
        throw new AuthenticationError('Not Logged In');
      }

      const linkRepo = getRepository(AnisTags);
      const existTag = await linkRepo
        .createQueryBuilder('anis_tags')
        .where('anis_tags.fk_tag_id = :tagId', { tagId: args.tagId })
        .getMany();

      if (existTag.length > 0) {
        return false;
      }

      const tagRepo = getRepository(Tag);
      await tagRepo
        .createQueryBuilder('tag')
        .delete()
        .where('id = :id', { id: args.tagId })
        .execute();
      return true;
    }
  }
};
