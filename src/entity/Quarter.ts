import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('quarters')
class Quarter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // [2019_1, 2019_2, 2019_3, 2019_4]
  @Index()
  @Column({
    length: 255
  })
  quarter!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Quarter;
