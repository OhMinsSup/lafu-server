import { createUserLoader } from '../entity/User';
import { createUserProfileLoader } from '../entity/UserProfile';

function createLoaders() {
  return {
    user: createUserLoader(),
    userProfile: createUserProfileLoader()
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
export default createLoaders;
