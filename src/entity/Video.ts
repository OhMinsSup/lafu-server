import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('videos', {
  synchronize: false
})
class Video {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}

export default Video;
