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
import Producer from './Poducer';
import Animation from './Animation';

@Entity('anis_producers')
class AnisProducers {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_ani_id!: string;

  @Index()
  @Column('uuid')
  fk_pd_id!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(type => Producer, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_pd_id' })
  producer!: Producer;

  @ManyToOne(type => Animation, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_ani_id' })
  animation!: Animation;
}

export default AnisProducers;
