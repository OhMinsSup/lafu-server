import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';

@Entity('animations', {
  synchronize: false
})
class Animation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 255 })
  url_slug!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ length: 255 })
  summary!: string;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  thumbnail!: string | null;

  @Column({ length: 255 })
  contentRating!: string;

  @Column({ default: 0 })
  likes!: number;

  @Column({ default: 0 })
  views!: number;

  @Column({ default: 0 })
  recommend!: number;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Animation;
