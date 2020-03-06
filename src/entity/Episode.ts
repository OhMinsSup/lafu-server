import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  getRepository,
  Index
} from 'typeorm';

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

  @Index()
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

  static async findEpisode(id: string) {
    const repo = getRepository(Episode);
    const episode = (await repo.findOne({
      where: {
        id
      }
    })) as Episode;
    return episode;
  }
}

export default Episode;
