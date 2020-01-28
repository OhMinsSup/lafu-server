import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  getRepository
} from 'typeorm';
import DataLoader from 'dataloader';
import Animation from './Animation';

export type BroadcastingTarget = 'OPEN' | 'CLOSE';
export type MediumType = 'TVA' | 'OVA' | 'MOVIE';

@Entity('broadcastings')
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

export const createBroadcastingLoader = () => {
  new DataLoader<string, Broadcasting[]>(async animationIdxs => {
    const repo = getRepository(Broadcasting);
    const broadcastings = await repo
      .createQueryBuilder('broadcastings')
      .where('fk_ani_id IN (:...animationIdxs)', { animationIdxs })
      .getMany();
    const BroadcastingListMap: {
      [key: string]: Broadcasting[];
    } = {};
    animationIdxs.forEach(animationIdx => (BroadcastingListMap[animationIdx] = []));
    broadcastings.forEach(broadcasting => {
      BroadcastingListMap[broadcasting.fk_ani_id].push(broadcasting);
    });
    const ordered = animationIdxs.map(animationIdx => BroadcastingListMap[animationIdx]);
    return ordered;
  });
};

export default Broadcasting;
