import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

export type BroadcastingTarget = 'OPEN' | 'CLOSE';

@Entity('Broadcastings', {
  synchronize: false
})
class Broadcasting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 255, enum: ['OPEN', 'CLOSE'] })
  broadcast!: BroadcastingTarget;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Broadcasting;
