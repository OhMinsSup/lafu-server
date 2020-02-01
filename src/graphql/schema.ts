import { gql, IResolvers, makeExecutableSchema } from 'apollo-server-express';
import merge from 'lodash/merge';
import * as hello from './hello';
import * as tag from './tag';
import * as genre from './genre';
import * as animation from './animation';

const typeDef = gql`
  scalar JSON
  scalar Date
  type Query {
    _version: String
  }
  type Mutation {
    _empty: String
  }
`;

const resolvers: IResolvers = {
  Query: {
    _version: () => '1.0'
  },
  Mutation: {}
};

const schema = makeExecutableSchema({
  typeDefs: [typeDef, hello.typeDef, animation.typeDef, tag.typeDef, genre.typeDef],
  resolvers: merge(resolvers, hello.resolvers, animation.resolvers, tag.resolvers, genre.resolvers)
});

export default schema;
