import { MigrationInterface, QueryRunner } from 'typeorm';

const names = [
  'admin_users',
  'animations',
  'anis_broadcast',
  'anis_genres',
  'anis_medium',
  'anis_old',
  'anis_quater',
  'anis_tags',
  'auth_tokens',
  'broadcasts',
  'files',
  'genres',
  'mediums',
  'olds',
  'quaters',
  'tags',
  'users',
  'user_profiles',
  'verifications'
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
