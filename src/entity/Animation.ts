/* eslint-disable @typescript-eslint/no-unused-vars */
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
  ManyToMany,
  OneToMany
} from 'typeorm';
import User from './User';
import Tag from './Tag';
import Genre from './Genre';
import Quater from './Quater';
import Medium from './Medium';
import Old from './Old';
import Broadcast from './Broadcast';

@Entity('animations')
class Animation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 255 })
  title!: string;

  @Column({ length: 255 })
  summary!: string;

  @Column({ length: 255, type: 'varchar' })
  thumbnail!: string;

  @Column({ type: 'varchar' })
  producer!: string[];

  @Column({ type: 'varchar' })
  screenplay!: string[];

  @Column({ array: true, type: 'varchar' })
  drawing!: string[];

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

  @Column('uuid')
  fk_user_id!: string;

  @Column('uuid')
  fk_quater_id!: string;

  @Column('uuid')
  fk_medium_id!: string;

  @Column('uuid')
  fk_old_id!: string;

  @Column('uuid')
  fk_broadcast_id!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(_type => Quater, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_quater_id' })
  quater!: Quater;

  @ManyToOne(_type => Medium, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_medium_id' })
  medium!: Medium;

  @ManyToOne(_type => Old, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_old_id' })
  old!: Old;

  @ManyToOne(_type => Broadcast, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_broadcast_id' })
  broadcast!: Broadcast;

  @ManyToOne(_type => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;

  @ManyToMany(_type => Tag)
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

  @ManyToMany(_type => Genre)
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
}

export default Animation;
