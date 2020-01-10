import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

export type ProducerTarget = 'TVA' | 'OVA' | 'MOVIE';

@Entity('producers', {
  synchronize: false
})
class Producer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 255, enum: ['TVA', 'OVA', 'MOVIE'] })
  producer!: ProducerTarget;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}

export default Producer;
