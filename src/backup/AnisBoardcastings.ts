// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Index,
//   Column,
//   UpdateDateColumn,
//   CreateDateColumn,
//   ManyToOne,
//   JoinColumn
// } from 'typeorm';
// import Broadcasting from './Broadcasting';
// import Animation from '../entity/Animation';

// @Entity('anis_boardcastings', {
//   synchronize: false
// })
// class AnisBoardcastings {
//   @PrimaryGeneratedColumn('uuid')
//   id!: string;

//   @Index()
//   @Column('uuid')
//   fk_ani_id!: string;

//   @Index()
//   @Column('uuid')
//   fk_bc_id!: string;

//   @Column('timestampz')
//   @CreateDateColumn()
//   created_at!: Date;

//   @Column('timestamptz')
//   @UpdateDateColumn()
//   updated_at!: Date;

//   @ManyToOne(type => Broadcasting, { cascade: true, eager: true })
//   @JoinColumn({ name: 'fk_pc_id' })
//   broadcasting!: Broadcasting;

//   @ManyToOne(type => Animation, { cascade: true, eager: true })
//   @JoinColumn({ name: 'fk_ani_id' })
//   animation!: Animation;
// }

// export default AnisBoardcastings;
