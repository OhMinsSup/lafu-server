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
import { groupById, normalize, normalizeKeyOfKey } from '../lib/utils';

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

  static async syncAnimationGenres(aniId: string, genreIds: string[]) {
    if (!aniId || genreIds.length === 0) {
      return null;
    }

    const repo = getRepository(AnisGenres);
    // get animation current genres
    const prevGenres = await repo.find({
      where: {
        fk_ani_id: aniId
      }
    });

    const normalized = {
      prev: normalize(prevGenres, aniGenre => aniGenre.fk_genre_id),
      current: normalizeKeyOfKey(genreIds)
    };

    // remove genres are missing
    const missing = prevGenres.filter(aniGenre => !normalized.current[aniGenre.fk_genre_id]);
    missing.forEach(genre => repo.remove(genre));

    // adds genres that are new
    const genresToAdd = genreIds.filter(genreId => !normalized.prev[genreId]);
    const anisGenres = genresToAdd.map(genreId => {
      const aniGenre = new AnisGenres();
      aniGenre.fk_ani_id = aniId;
      aniGenre.fk_genre_id = genreId;
      return aniGenre;
    });
    return repo.save(anisGenres);
  }
}

export const createGenresLoader = () =>
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

export default AnisGenres;
