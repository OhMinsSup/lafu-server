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
import Genre from './Genre';
import Animation from './Animation';
import DataLoader = require('dataloader');
import { groupById } from '../lib/utils';

@Entity('anis_genres')
class AnisGenres {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_ani_id!: string;

  @Index()
  @Column('uuid')
  fk_genre_id!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(type => Genre, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_genre_id' })
  genre!: Genre;

  @ManyToOne(type => Animation, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_ani_id' })
  animation!: Animation;
}

export const createGenresLoader = () => {
  new DataLoader<string, Genre[]>(async animationIdxs => {
    const repo = getRepository(AnisGenres);
    const anisGenres = await repo
      .createQueryBuilder('anis_genres')
      .where('fk_ani_id IN (:...animationIdxs)', { animationIdxs })
      .leftJoinAndSelect('anis_genres.genre', 'genre')
      .orderBy('fk_ani_id', 'ASC')
      .orderBy('genre.genre_name', 'ASC')
      .getMany();

    return groupById<AnisGenres>(animationIdxs, anisGenres, at => at.fk_ani_id).map(array =>
      array.map(at => at.genre)
    );
  });
};

export default AnisGenres;
