import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

export type BroadcastingTarget = 'OPEN' | 'CLOSE';
export type MediumType = 'TVA' | 'OVA' | 'MOVIE';

@Entity('broadcastings', {
  synchronize: false
})
class Broadcasting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 몇세 이용가
  @Column({ length: 255 })
  contentRating!: string;

  // 방영중 | 완결
  @Index()
  @Column({ length: 255, enum: ['OPEN', 'CLOSE'] })
  broadcast_type!: BroadcastingTarget;

  @Index()
  @Column({ length: 255, enum: ['TVA', 'OVA', 'MOVIE'] })
  medium!: MediumType;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Broadcasting;
