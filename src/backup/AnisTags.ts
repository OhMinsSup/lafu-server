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
// import Animation from '../entity/Animation';
// import Tag from './Tag';

// @Entity('anis_tags', {
//   synchronize: false
// })
// class AnisTags {
//   @PrimaryGeneratedColumn('uuid')
//   id!: string;

//   @Index()
//   @Column('uuid')
//   fk_ani_id!: string;

//   @Index()
//   @Column('uuid')
//   fk_tag_id!: string;

//   @Column('timestampz')
//   @CreateDateColumn()
//   created_at!: Date;

//   @Column('timestamptz')
//   @UpdateDateColumn()
//   updated_at!: Date;

//   @ManyToOne(type => Tag, { cascade: true, eager: true })
//   @JoinColumn({ name: 'fk_tag_id' })
//   tag!: Tag;

//   @ManyToOne(type => Animation, { cascade: true, eager: true })
//   @JoinColumn({ name: 'fk_ani_id' })
//   animation!: Animation;
// }

// export default AnisTags;
