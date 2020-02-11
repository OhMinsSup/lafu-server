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
