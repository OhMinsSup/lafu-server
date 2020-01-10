import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';

@Entity('genres', {
  synchronize: false
})
class Genre {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 25 })
  genre!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Genre;
