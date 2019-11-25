import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  getRepository
} from 'typeorm';
import DataLoader from 'dataloader';
import User from './User';
import { normalize } from '../lib/utils';

@Entity('user_status', {
  synchronize: false
})
class UserStatus {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: false })
  isDriving!: boolean;

  @Column({ default: false })
  isRiding!: boolean;

  @Column({ default: false })
  isTaken!: boolean;

  @Column({ type: 'double precision', default: 0 })
  lastLng!: number;

  @Column({ type: 'double precision', default: 0 })
  lastLat!: number;

  @Column({ type: 'double precision', default: 0 })
  lastOrientation!: number;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne(type => User, { cascade: true })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;

  @Column('uuid')
  fk_user_id!: string;
}

export const createUserStatusLoader = () =>
  new DataLoader<string, UserStatus>(async userIds => {
    const repo = getRepository(UserStatus);
    const status = await repo
      .createQueryBuilder('user_status')
      .where('fk_user_id IN (:...userIds)', { userIds })
      .getMany();

    const normalized = normalize(status, status => status.fk_user_id);
    const ordered = userIds.map(id => normalized[id]);
    return ordered;
  });

export default UserStatus;
