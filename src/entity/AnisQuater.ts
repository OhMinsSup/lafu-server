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
import Quarter from './Quarter';

@Entity('anis_quarter')
class AnisQuater {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_quater_id!: string;

  @Index()
  @Column('uuid')
  fk_ani_id!: string;

  @ManyToOne(type => Animation, animation => animation.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_ani_id' })
  animation!: Animation;

  @ManyToOne(type => Quarter, quarter => quarter.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_quarter_id' })
  quarter!: Quarter;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default AnisQuater;
