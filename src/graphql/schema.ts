import { gql, IResolvers, makeExecutableSchema } from 'apollo-server-express';
import merge from 'lodash/merge';
import * as hello from './hello';
import * as medium from './medium';

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
  typeDefs: [typeDef, hello.typeDef, medium.typeDef],
  resolvers: merge(resolvers, hello.resolvers, medium.resolvers)
});

export default schema;
