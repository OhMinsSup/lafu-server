import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  getRepository
} from 'typeorm';

@Entity('tags')
class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 255 })
  tag_name!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  static findByName(name: string) {
    const repo = getRepository(Tag);
    return repo
      .createQueryBuilder('tag')
      .where(
        `
        lower(tag.tag_name) = lower(:name)
        OR lower(replace(tag.name, ' ', '-')) = lower(replace(:name, ' ', '-'))
        `,
        {
          name
        }
      )
      .getOne();
  }

  static async findOrCreate(name: string) {
    const tag = await Tag.findByName(name);
    if (tag) {
      return tag;
    }
    const repo = getRepository(Tag);
    const freshTag = new Tag();
    freshTag.tag_name = name;
    await repo.save(freshTag);
    return freshTag;
  }

  // 여기서 null및 undefind 처리를 안하는 이유는
  // tag의 경우 관리자가 생성하고 관리하고 태그를 선택할 때
  // 이미 생성이 보장된 uuid값을 던져주기 때문에 이렇게 함
  static async findTag(id: string) {
    const repo = getRepository(Tag);
    const tag = (await repo.findOne({
      where: {
        id
      }
    })) as Tag;
    return tag;
  }
}

export default Tag;
