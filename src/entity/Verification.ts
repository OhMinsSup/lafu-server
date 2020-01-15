import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

export type VerificationTarget = 'EMAIL';

@Entity('verifications')
class Verification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', enum: ['EMAIL'] })
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
