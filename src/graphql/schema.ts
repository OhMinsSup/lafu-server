import { gql, IResolvers, makeExecutableSchema } from 'apollo-server-express';
import merge from 'lodash/merge';
import * as hello from './hello';
import * as user from './user';
import DateScalar from './scalars/DateScalar';

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
  Mutation: {},
  Date: DateScalar
};

const schema = makeExecutableSchema({
  typeDefs: [typeDef, hello.typeDef, user.typeDef],
  resolvers: merge(resolvers, hello.resolvers, user.resolvers)
});

export default schema;
