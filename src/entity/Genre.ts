import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  getRepository,
  JoinColumn
} from 'typeorm';
import DataLoader from 'dataloader';
import Animation from './Animation';

@Entity('genres')
class Genre {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  fk_ani_id!: string;

  @Index()
  @Column({ length: 25 })
  genre_name!: string;

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

export const createGenresLoader = () => {
  new DataLoader<string, Genre[]>(async animationIdxs => {
    const repo = getRepository(Genre);
    const genres = await repo
      .createQueryBuilder('genres')
      .where('fk_ani_id IN (:...animationIdxs)', { animationIdxs })
      .getMany();
    const genreListMap: {
      [key: string]: Genre[];
    } = {};
    animationIdxs.forEach(animationIdx => (genreListMap[animationIdx] = []));
    genres.forEach(genre => {
      genreListMap[genre.fk_ani_id].push(genre);
    });
    const ordered = animationIdxs.map(animationIdx => genreListMap[animationIdx]);
    return ordered;
  });
};

export default Genre;
