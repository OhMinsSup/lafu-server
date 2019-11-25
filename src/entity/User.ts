import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  getRepository,
  OneToOne
} from 'typeorm';
import DataLoader from 'dataloader';
import UserProfile from './UserProfile';
import UserStatus from './UserStatus';

@Entity('users', {
  synchronize: false
})
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  username!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  email!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  phoneNumber!: string;

  @Column({ default: false })
  verifiedEmail!: boolean;

  @Column({ default: false })
  verifiedPhoneNumber!: boolean;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @OneToOne(type => UserProfile, profile => profile.user)
  profile!: UserProfile;

  @OneToOne(type => UserStatus, status => status.user)
  status!: UserStatus;
}

export const createUserLoader = () =>
  new DataLoader<string, User>(ids => {
    const repo = getRepository(User);
    const users = repo.findByIds(ids);
    return users;
  });

export default User;
