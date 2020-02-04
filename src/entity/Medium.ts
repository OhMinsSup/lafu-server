import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';

export type MediumType = 'TVA' | 'OVA' | 'MOVIE';

@Entity('mediums')
class Medium {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

export default Medium;
