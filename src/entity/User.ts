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
import { generateToken } from '../lib/tokens';
import AuthToken from './AuthToken';

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

  async generateUserToken() {
    const authToken = new AuthToken();
    authToken.fk_user_id = this.id;
    await getRepository(AuthToken).save(authToken);

    // refresh token is valid for 30days
    const refreshToken = await generateToken(
      {
        user_id: this.id,
        token_id: authToken.id
      },
      {
        subject: 'refresh_token',
        expiresIn: '30d'
      }
    );

    const accessToken = await generateToken(
      {
        user_id: this.id
      },
      {
        subject: 'access_token',
        expiresIn: '1h'
      }
    );

    return {
      refreshToken,
      accessToken
    };
  }

  async refreshUserToken(tokenId: string, refreshTokenExp: number, originalRefreshToken: string) {
    const now = new Date().getTime();
    const diff = refreshTokenExp * 1000 - now;
    console.log('refreshing..');
    let refreshToken = originalRefreshToken;
    // renew refresh token if remaining life is less than 15d
    if (diff < 1000 * 60 * 60 * 24 * 15) {
      console.log('refreshing refreshToken');
      refreshToken = await generateToken(
        {
          user_id: this.id,
          token_id: tokenId
        },
        {
          subject: 'refresh_token',
          expiresIn: '30d'
        }
      );
    }
    const accessToken = await generateToken(
      {
        user_id: this.id
      },
      {
        subject: 'access_token',
        expiresIn: '1h'
      }
    );

    return { refreshToken, accessToken };
  }
}

export const createUserLoader = () =>
  new DataLoader<string, User>(ids => {
    const repo = getRepository(User);
    const users = repo.findByIds(ids);
    return users;
  });

export default User;
