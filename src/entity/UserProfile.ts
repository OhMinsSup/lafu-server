import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  getRepository
} from 'typeorm';
import DataLoader from 'dataloader';
import User from './User';
import { normalize } from '../lib/utils';

export type GenderTarget = 'MALE' | 'FEMALE' | 'UNKNOWN';

@Entity('user_profiles')
class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  display_name!: string;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  thumbnail!: string | null;

  @Column({ length: 255, enum: ['MALE', 'FEMALE', 'UNKNOWN'], default: 'UNKNOWN' })
  gender!: GenderTarget;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  birth!: string | null;

  @Column({
    default: {},
    type: 'jsonb'
  })
  profile_links!: any;

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

export const createUserProfileLoader = () =>
  new DataLoader<string, UserProfile>(async userIds => {
    const repo = getRepository(UserProfile);
    const profiles = await repo
      .createQueryBuilder('user_profiles')
      .where('fk_user_id IN (:...userIds)', { userIds })
      .getMany();

    const normalized = normalize(profiles, profile => profile.fk_user_id);
    const ordered = userIds.map(id => normalized[id]);
    return ordered;
  });

export default UserProfile;
