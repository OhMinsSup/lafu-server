import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  getRepository
} from 'typeorm';
import DataLoader from 'dataloader';
import Animation from './Animation';

@Entity('episodes')
class Episode {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ length: 255 })
  subject!: string;

  @Column({ length: 255 })
  description!: string;

  @Column({ length: 255 })
  thumbnail!: string;

  @Column({ type: 'int' })
  op_start!: number;

  @Column({ type: 'int' })
  op_end!: number;

  @Column({ type: 'int' })
  ed_start!: number;

  @Column({ type: 'int' })
  ed_end!: number;

  @Column({ type: 'int' })
  action_time!: number;

  @Column({ type: 'int', default: 1 })
  episode_order!: number;

  @Column({ length: 255 })
  running_time!: string;

  @Column({ length: 255 })
  fileUrl!: string;

  @Column('uuid')
  fk_ani_id!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(type => Animation, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_ani_id' })
  animation!: Animation;
}

export const createEpisodeLoader = () =>
  new DataLoader<string, Episode[]>(async animationIdxs => {
    const repo = getRepository(Episode);
    const episodes = await repo
      .createQueryBuilder('episodes')
      .where('fk_ani_id IN (:...animationIdxs)', { animationIdxs })
      .getMany();

    const EpisodeListMap: {
      [key: string]: Episode[];
    } = {};
    animationIdxs.forEach(animationIdx => (EpisodeListMap[animationIdx] = []));
    episodes.forEach(episode => {
      EpisodeListMap[episode.fk_ani_id].push(episode);
    });
    const ordered = animationIdxs.map(animationIdx => EpisodeListMap[animationIdx]);
    return ordered;
  });
export default Episode;
