import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  getRepository
} from 'typeorm';
import User from './User';

@Entity('admin_users')
class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column('uuid')
  fk_user_id!: string;

  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  static async checkAdmin(userId: string) {
    const repo = getRepository(AdminUser);
    const adminUser = await repo.findOne({
      where: {
        fk_user_id: userId
      }
    });
    return !!adminUser;
  }
}

export default AdminUser;
