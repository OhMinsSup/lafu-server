import { createUserLoader } from '../entity/User';
import { createUserProfileLoader } from '../entity/UserProfile';
import { createTagsLoader } from '../entity/AnisTags';
import { createGenresLoader } from '../entity/Genre';
import { createBroadcastingLoader } from '../entity/Broadcasting';

function createLoaders() {
  return {
    user: createUserLoader(),
    userProfile: createUserProfileLoader(),
    tags: createTagsLoader(),
    genres: createGenresLoader(),
    broadcastings: createBroadcastingLoader()
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
export default createLoaders;
