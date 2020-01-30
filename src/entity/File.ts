import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index
} from 'typeorm';

@Entity('files')
class File {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  path!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255 })
  type!: string;

  @Index()
  @Column({ length: 255, enum: ['video', 'image'] })
  resource_type!: 'video' | 'image';

  @Index()
  @Column('uuid')
  ref_id!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default File;
