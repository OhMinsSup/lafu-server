import { createUserLoader } from '../entity/User';
import { createUserProfileLoader } from '../entity/UserProfile';
import { createUserStatusLoader } from '../entity/UserStatus';

function createLoaders() {
  return {
    user: createUserLoader(),
    userProfile: createUserProfileLoader(),
    userStatus: createUserStatusLoader()
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
export default createLoaders;
