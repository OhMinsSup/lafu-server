import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  getRepository
} from 'typeorm';
import DataLoader from 'dataloader';
import Animation from './Animation';
import Tag from './Tag';
import { groupById } from '../lib/utils';

@Entity('anis_tags')
class AnisTags {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_ani_id!: string;

  @Index()
  @Column('uuid')
  fk_tag_id!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(type => Tag, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_tag_id' })
  tag!: Tag;

  @ManyToOne(type => Animation, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_ani_id' })
  animation!: Animation;
}

export const createTagsLoader = () => {
  new DataLoader<string, Tag[]>(async animationIdxs => {
    const repo = getRepository(AnisTags);
    const anisTags = await repo
      .createQueryBuilder('anis_tags')
      .where('fk_ani_id IN (:...animationIdxs)', { animationIdxs })
      .leftJoinAndSelect('anis_tags.tag', 'tag')
      .orderBy('fk_ani_id', 'ASC')
      .orderBy('tag.tag_name', 'ASC')
      .getMany();

    return groupById<AnisTags>(animationIdxs, anisTags, at => at.fk_ani_id).map(array =>
      array.map(at => at.tag)
    );
  });
};

export default AnisTags;
