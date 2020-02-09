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
import Old from './Old';

@Entity('anis_old')
class AnisOld {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_old_id!: string;

  @Index()
  @Column('uuid')
  fk_ani_id!: string;

  @ManyToOne(type => Animation, animation => animation.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_ani_id' })
  animation!: Animation;

  @ManyToOne(type => Old, old => old.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_old_id' })
  old!: Old;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default AnisOld;
