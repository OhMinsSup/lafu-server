import { Resolvers } from '../../../config/context';
import { HelloQueryResponse, HelloQueryArgs } from './Hello.model';

const resolvers: Resolvers = {
  Query: {
    Hello: (_, args: HelloQueryArgs, ___): HelloQueryResponse => {
      return {
        result: `Hello ${args.name || 'World'}`
      };
    }
  }
};

export default resolvers;
