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
  title!: string;

  @Column({ length: 255 })
  summary!: string;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  thumbnail!: string | null;

  // 보고싶다
  @Column({ default: 0 })
  likes!: number;

  // 별점주기
  @Column({ default: 0 })
  stars!: number;

  // 명작 추천
  @Column({ default: 0 })
  recommend!: number;

  // 성인인지 아닌지
  @Column({ default: false })
  is_adult!: boolean;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Animation;
