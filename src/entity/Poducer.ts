import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import Animation from './Animation';

@Entity('producers')
class Producer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  producer!: string[];

  @Column({ type: 'varchar' })
  screenplay!: string[];

  @Column({ array: true, type: 'varchar' })
  drawing!: string[];

  // [2019_1, 2019_2, 2019_3, 2019_4]
  @Index()
  @Column({
    length: 255,
    nullable: false
  })
  released_at!: string;

  @Column('uuid')
  fk_ani_id!: string;

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

export default Producer;
