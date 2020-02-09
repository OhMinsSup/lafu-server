import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import Animation from './Animation';
import Broadcast from './Broadcast';

@Entity('anis_broadcast')
class AnisBroadcast {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_broadcast_id!: string;

  @Index()
  @Column('uuid')
  fk_ani_id!: string;

  @ManyToOne(type => Animation, animation => animation.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_ani_id' })
  animation!: Animation;

  @ManyToOne(type => Broadcast, broadcast => broadcast.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_broadcast_id' })
  broadcast!: Broadcast;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default AnisBroadcast;
