import { MigrationInterface, QueryRunner } from 'typeorm';

const names = [
  'verifications',
  'users',
  'user_profiles',
  'tags',
  'producers',
  'genres',
  'broadcastings',
  'anis_tags',
  'anis_producers',
  'anis_genres',
  'anis_broadcastings',
  'animations'
];

export class SetDefaultUUID1579614580581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (let i = 0; i < names.length; i += 1) {
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN id SET DEFAULT uuid_generate_v4()`
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    for (let i = 0; i < names.length; i += 1) {
      await queryRunner.query(`ALTER TABLE public.${names[i]} ALTER COLUMN id SET DEFAULT NULL`);
    }
  }
}
