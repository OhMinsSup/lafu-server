import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import Animation from './Animation';
import Medium from './Medium';

@Entity('anis_medium')
class AnisMedium {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_medium_id!: string;

  @Index()
  @Column('uuid')
  fk_ani_id!: string;

  @ManyToOne(type => Animation, animation => animation.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_ani_id' })
  animation!: Animation;

  @ManyToOne(type => Medium, medium => medium.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_medium_id' })
  medium!: Medium;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default AnisMedium;
