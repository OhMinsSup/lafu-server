import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  getRepository,
  getManager
} from 'typeorm';
import DataLoader from 'dataloader';
import Animation from './Animation';
import Tag from './Tag';
import { groupById, normalize, normalizeKeyOfKey } from '../lib/utils';

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

  static async getBelogingTags(aniId: string) {
    const manager = getManager();
    const tags = await manager.query(
      `
      select distinct  * from tags
      inner join anis_tags on tags.id = anis_tags.fk_ani_id
      inner join tags on anis_tags.fk_tag_id = tags.id
      where 
      `,
      [aniId]
    );

    return tags;
  }

  static async syncAnimationTags(aniId: string, tagIds: string[]) {
    if (!aniId || tagIds.length === 0) {
      return null;
    }

    const repo = getRepository(AnisTags);
    // get animation current tags
    const prevAniTags = await repo.find({
      where: {
        fk_ani_id: aniId
      }
    });

    const normalized = {
      prev: normalize(prevAniTags, aniTag => aniTag.fk_tag_id),
      current: normalizeKeyOfKey(tagIds)
    };

    // remove tags are missing
    const missing = prevAniTags.filter(aniTag => !normalized.current[aniTag.fk_tag_id]);
    missing.forEach(tag => repo.remove(tag));

    // adds tags that are new
    const tagsToAdd = tagIds.filter(tagId => !normalized.prev[tagId]);
    const anisTags = tagsToAdd.map(tagId => {
      const aniTag = new AnisTags();
      aniTag.fk_ani_id = aniId;
      aniTag.fk_tag_id = tagId;
      return aniTag;
    });
    return repo.save(anisTags);
  }
}

export const createTagsLoader = () =>
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

export default AnisTags;
