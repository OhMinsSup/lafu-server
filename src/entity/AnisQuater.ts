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
import Quater from './Quater';

@Entity('anis_quater')
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

  @ManyToOne(type => Quater, quater => quater.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_quater_id' })
  quater!: Quater;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default AnisQuater;
