import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import Animation from './Animation';
import Genre from './Genre';

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

export default AnisGenres;
