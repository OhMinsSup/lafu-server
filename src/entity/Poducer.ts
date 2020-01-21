import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('producers')
class Producer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar' })
  producer!: string[];

  @Column({ array: true, type: 'varchar' })
  drawing!: string[];

  // [2019_1, 2019_2, 2019_3, 2019_4]
  @Index()
  @Column({
    length: 255,
    nullable: false
  })
  released_at!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Producer;
