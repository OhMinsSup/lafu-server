import { gql, IResolvers } from 'apollo-server-express';
import { ApolloContext } from '../app';

export const typeDef = gql`
  type User {
    id: ID!
    username: String
    email: String
    created_at: Date
    updated_at: Date
    is_certified: Boolean
    profile: UserProfile
  }
  type UserProfile {
    id: ID!
    display_name: String
    birth: String
    thumbnail: String
    created_at: Date
    updated_at: Date
    gender: String
    profile_links: JSON
  }
`;

export const resolvers: IResolvers<any, ApolloContext> = {};
