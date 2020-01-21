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

export class SetDefaultDate1579614945861 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (let i = 0; i < names.length; i += 1) {
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN updated_at SET DEFAULT now();`
      );
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN created_at SET DEFAULT now();`
      );
    }
    await queryRunner.query(`ALTER TABLE public.posts ALTER COLUMN released_at SET DEFAULT now();`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    for (let i = 0; i < names.length; i += 1) {
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN updated_at SET DEFAULT NULL;`
      );
      await queryRunner.query(
        `ALTER TABLE public.${names[i]} ALTER COLUMN created_at SET DEFAULT NULL;`
      );
    }
    await queryRunner.query(`ALTER TABLE public.posts ALTER COLUMN released_at SET DEFAULT NULL;`);
  }
}
