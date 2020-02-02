import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  getRepository
} from 'typeorm';

@Entity('genres')
class Genre {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 25 })
  genre_name!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  static async getGenres() {
    const repo = getRepository(Genre);
    const genres = await repo.createQueryBuilder('genre').getMany();
    return genres;
  }

  static findByName(name: string) {
    const repo = getRepository(Genre);
    return repo
      .createQueryBuilder('genre')
      .where(
        `
        lower(genre.genre_name) = lower(:name)
        OR lower(replace(genre.genre_name, ' ', '-')) = lower(replace(:name, ' ', '-'))
        `,
        {
          name
        }
      )
      .getOne();
  }

  static async findOrCreate(name: string) {
    const genre = await Genre.findByName(name);
    if (genre) {
      return genre;
    }
    const repo = getRepository(Genre);
    const freshGenre = new Genre();
    freshGenre.genre_name = name;
    await repo.save(freshGenre);
    return freshGenre;
  }

  // 여기서 null및 undefind 처리를 안하는 이유는
  // tag의 경우 관리자가 생성하고 관리하고 태그를 선택할 때
  // 이미 생성이 보장된 uuid값을 던져주기 때문에 이렇게 함
  static async findGenre(id: string) {
    const repo = getRepository(Genre);
    const genre = (await repo.findOne({
      where: {
        id
      }
    })) as Genre;
    return genre;
  }
}

export default Genre;
