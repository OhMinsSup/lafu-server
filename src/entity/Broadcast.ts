import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

export type BroadcastType = 'OPEN' | 'CLOSE';

@Entity('broadcasts')
class Broadcast {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 방영중 | 완결
  @Index()
  @Column({ length: 255, enum: ['OPEN', 'CLOSE'] })
  broadcast!: BroadcastType;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Broadcast;
