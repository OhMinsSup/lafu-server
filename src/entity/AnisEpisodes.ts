import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  getRepository
} from 'typeorm';
import DataLoader from 'dataloader';
import Episode from './Episode';
import Animation from './Animation';
import { groupById, normalize } from '../lib/utils';

@Entity('anis_episodes', {
  synchronize: false
})
class AnisEpisodes {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_ani_id!: string;

  @Index()
  @Column('uuid')
  fk_episode_id!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(type => Episode, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_episode_id' })
  episode!: Episode;

  @ManyToOne(type => Animation, { cascade: true })
  @JoinColumn({ name: 'fk_ani_id' })
  animation!: Animation;

  static async syncAnimationEpisode(aniId: string, episodes: Episode[]) {
    if (!aniId || episodes.length === 0) {
      return null;
    }

    const repo = getRepository(AnisEpisodes);
    const prevEpisodes = await repo.find({
      where: {
        fk_ani_id: aniId
      }
    });

    const normalized = {
      prev: normalize(prevEpisodes, anisEpisodes => anisEpisodes.fk_episode_id),
      current: normalize(episodes)
    };

    const missing = prevEpisodes.filter(
      anisEpisodes => !normalized.current[anisEpisodes.fk_episode_id]
    );
    missing.forEach(episode => repo.remove(episode));

    const epsiodesToAdd = episodes.filter(episode => !normalized.prev[episode.id]);
    const anisEpisodes = epsiodesToAdd.map(ep => {
      const aniEp = new AnisEpisodes();
      aniEp.fk_ani_id = aniId;
      aniEp.fk_episode_id = ep.id;
      return aniEp;
    });
    return repo.save(anisEpisodes);
  }
}

export const createEpisodesLoader = () => {
  new DataLoader<string, Episode[]>(async animationIdxs => {
    const repo = getRepository(AnisEpisodes);
    const anisEpisodes = await repo
      .createQueryBuilder('anis_episodes')
      .where('fk_ani_id IN (:...animationIdxs)', { animationIdxs })
      .leftJoinAndSelect('anis_episodes.episode', 'episode')
      .orderBy('fk_ani_id', 'ASC')
      .orderBy('episode.episode_order', 'ASC')
      .getMany();

    return groupById<AnisEpisodes>(animationIdxs, anisEpisodes, ae => ae.fk_ani_id).map(array =>
      array.map(ae => ae.episode)
    );
  });
};

export default AnisEpisodes;
