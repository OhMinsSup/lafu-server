import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany
} from 'typeorm';
import User from './User';
import Tag from './Tag';
import Genre from './Genre';
import Producer from './Poducer';
import Broadcasting from './Broadcasting';

@Entity('animations')
class Animation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 255 })
  title!: string;

  @Column({ length: 255 })
  summary!: string;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  thumbnail!: string | null;

  @Column('uuid')
  fk_user_id!: string;

  // 보고싶다
  @Column({ default: 0 })
  likes!: number;

  // 별점주기
  @Column({ default: 0 })
  stars!: number;

  // 명작 추천
  @Column({ default: 0 })
  recommend!: number;

  // 성인인지 아닌지
  @Column({ default: false })
  is_adult!: boolean;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(type => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;

  @ManyToMany(type => Tag)
  @JoinTable({
    name: 'anis_tags',
    joinColumn: {
      name: 'fk_ani_id'
    },
    inverseJoinColumn: {
      name: 'fk_tag_id'
    }
  })
  tags!: Tag[];

  @ManyToMany(type => Genre)
  @JoinTable({
    name: 'anis_genres',
    joinColumn: {
      name: 'fk_ani_id'
    },
    inverseJoinColumn: {
      name: 'fk_genre_id'
    }
  })
  genres!: Genre[];

  @ManyToMany(type => Producer)
  @JoinTable({
    name: 'anis_producers',
    joinColumn: {
      name: 'fk_ani_id'
    },
    inverseJoinColumn: {
      name: 'fk_pd_id'
    }
  })
  producers!: Producer[];

  @ManyToMany(type => Broadcasting)
  @JoinTable({
    name: 'anis_broadcastings',
    joinColumn: {
      name: 'fk_ani_id'
    },
    inverseJoinColumn: {
      name: 'fk_bc_id'
    }
  })
  broadcastings!: Broadcasting[];
}

export default Animation;
