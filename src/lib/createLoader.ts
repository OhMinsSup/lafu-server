import { createUserLoader } from '../entity/User';
import { createUserProfileLoader } from '../entity/UserProfile';
import { createTagsLoader } from '../entity/AnisTags';
import { createGenresLoader } from '../entity/AnisGenre';
import { createEpisodesLoader } from '../entity/AnisEpisodes';

function createLoaders() {
  return {
    episodes: createEpisodesLoader(),
    user: createUserLoader(),
    userProfile: createUserProfileLoader(),
    tags: createTagsLoader(),
    genres: createGenresLoader()
  };
}

export type Loaders = ReturnType<typeof createLoaders>;
export default createLoaders;
