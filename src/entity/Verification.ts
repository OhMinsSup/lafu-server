import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

export type VerificationTarget = 'PHONE' | 'EMAIL';

@Entity('verifications', {
  synchronize: true
})
class Verification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', enum: ['PHONE', 'EMAIL'] })
  target!: VerificationTarget;

  @Column({ length: 255 })
  payload!: string;

  @Index()
  @Column({ length: 255 })
  code!: string;

  @Column({ default: false })
  logged!: boolean;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Verification;
